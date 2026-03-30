from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from epidemic_pipeline.config import (
    DEFAULT_FORECAST_DAYS,
    DEFAULT_TEST_SIZE,
    JHU_CONFIRMED_URL,
    OUTPUT_DIR,
    RAW_DATA_PATH,
)
from epidemic_pipeline.data import build_country_timeseries, download_latest_dataset, load_dataset
from epidemic_pipeline.evaluate import regression_metrics
from epidemic_pipeline.features import add_features, model_columns, training_frame
from epidemic_pipeline.forecast import recursive_forecast
from epidemic_pipeline.model import fit_and_select_model, split_train_test


def parse_args():
    parser = argparse.ArgumentParser(description="Batch epidemic forecasting for top countries")
    parser.add_argument("--top-n", type=int, default=20, help="Number of top countries by latest cases")
    parser.add_argument("--forecast-days", type=int, default=DEFAULT_FORECAST_DAYS)
    parser.add_argument("--test-size", type=float, default=DEFAULT_TEST_SIZE)
    parser.add_argument("--refresh-data", action="store_true")
    parser.add_argument("--data-path", default=str(RAW_DATA_PATH))
    return parser.parse_args()


def top_countries_by_latest_cases(df: pd.DataFrame, top_n: int) -> list[str]:
    grouped = df.groupby("Country/Region", as_index=False).sum(numeric_only=True)
    latest_col = grouped.columns[-1]
    ranked = grouped.sort_values(latest_col, ascending=False)
    return ranked["Country/Region"].head(top_n).tolist()


def safe_name(country: str) -> str:
    return country.lower().replace(" ", "_").replace(",", "")


def run_for_country(df: pd.DataFrame, country: str, forecast_days: int, test_size: float):
    country_ts = build_country_timeseries(df, country)
    feat_df = add_features(country_ts)
    frame = training_frame(feat_df)

    if len(frame) < 60:
        raise ValueError("insufficient rows after feature engineering")

    train_split, test_split = split_train_test(frame, test_size=test_size)
    feature_cols = model_columns()

    model_bundle, _ = fit_and_select_model(train_split, test_split, feature_cols)

    y_test = test_split["Cases"].values
    y_pred = model_bundle.model.predict(test_split[feature_cols])
    metrics = regression_metrics(y_test, y_pred)

    forecast_df = recursive_forecast(country_ts, model_bundle.model, forecast_days)
    return model_bundle.name, metrics, forecast_df


def main():
    args = parse_args()
    data_path = Path(args.data_path)

    if args.refresh_data:
        print("Downloading latest dataset...")
        download_latest_dataset(JHU_CONFIRMED_URL, data_path)

    df = load_dataset(data_path)
    countries = top_countries_by_latest_cases(df, args.top_n)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    batch_dir = OUTPUT_DIR / "batch"
    batch_dir.mkdir(parents=True, exist_ok=True)

    rows = []
    for idx, country in enumerate(countries, start=1):
        try:
            model_name, metrics, forecast_df = run_for_country(
                df,
                country,
                forecast_days=args.forecast_days,
                test_size=args.test_size,
            )
            out_csv = batch_dir / f"forecast_{safe_name(country)}.csv"
            forecast_df.to_csv(out_csv, index=False)
            rows.append(
                {
                    "country": country,
                    "model": model_name,
                    "mae": metrics["mae"],
                    "rmse": metrics["rmse"],
                    "mape": metrics["mape"],
                    "forecast_file": str(out_csv),
                }
            )
            print(f"[{idx}/{len(countries)}] Done: {country}")
        except Exception as exc:
            rows.append(
                {
                    "country": country,
                    "model": "failed",
                    "mae": None,
                    "rmse": None,
                    "mape": None,
                    "forecast_file": "",
                    "error": str(exc),
                }
            )
            print(f"[{idx}/{len(countries)}] Failed: {country} -> {exc}")

    summary_path = OUTPUT_DIR / "batch_summary.csv"
    pd.DataFrame(rows).to_csv(summary_path, index=False)
    print(f"\nBatch run complete. Summary: {summary_path}")


if __name__ == "__main__":
    main()
