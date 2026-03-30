from __future__ import annotations

import argparse
from pathlib import Path

from epidemic_pipeline.config import (
    DEFAULT_COUNTRY,
    DEFAULT_FORECAST_DAYS,
    DEFAULT_TEST_SIZE,
    JHU_CONFIRMED_URL,
    OUTPUT_DIR,
    RAW_DATA_PATH,
)
from epidemic_pipeline.data import (
    build_country_timeseries,
    download_latest_dataset,
    load_dataset,
)
from epidemic_pipeline.evaluate import regression_metrics
from epidemic_pipeline.features import add_features, model_columns, training_frame
from epidemic_pipeline.forecast import recursive_forecast
from epidemic_pipeline.heatmap import build_latest_heatmap
from epidemic_pipeline.model import fit_and_select_model, split_train_test
from epidemic_pipeline.visualize import save_country_and_forecast_plot


def parse_args():
    parser = argparse.ArgumentParser(description="Live epidemic spread prediction pipeline")
    parser.add_argument("--country", default=DEFAULT_COUNTRY, help="Country name in dataset")
    parser.add_argument("--forecast-days", type=int, default=DEFAULT_FORECAST_DAYS)
    parser.add_argument("--test-size", type=float, default=DEFAULT_TEST_SIZE)
    parser.add_argument(
        "--refresh-data",
        action="store_true",
        help="Download latest CSV from Johns Hopkins GitHub before training",
    )
    parser.add_argument(
        "--data-path",
        default=str(RAW_DATA_PATH),
        help="Path to local CSV file",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    data_path = Path(args.data_path)

    if args.refresh_data:
        print("Downloading latest dataset...")
        download_latest_dataset(JHU_CONFIRMED_URL, data_path)
        print(f"Updated data saved to: {data_path}")

    df = load_dataset(data_path)
    country_ts = build_country_timeseries(df, args.country)

    feat_df = add_features(country_ts)
    train_df = training_frame(feat_df)

    if len(train_df) < 60:
        raise ValueError("Not enough data points after feature engineering for stable training")

    train_split, test_split = split_train_test(train_df, test_size=args.test_size)
    feature_cols = model_columns()

    model_bundle, holdout_mae = fit_and_select_model(train_split, test_split, feature_cols)

    y_test = test_split["Cases"].values
    y_pred = model_bundle.model.predict(test_split[feature_cols])
    metrics = regression_metrics(y_test, y_pred)

    forecast_df = recursive_forecast(country_ts, model_bundle.model, args.forecast_days)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    forecast_csv = OUTPUT_DIR / f"forecast_{args.country.replace(' ', '_').lower()}.csv"
    forecast_df.to_csv(forecast_csv, index=False)

    plot_path = OUTPUT_DIR / f"forecast_plot_{args.country.replace(' ', '_').lower()}.png"
    save_country_and_forecast_plot(country_ts, forecast_df, args.country, plot_path)

    heatmap_path = OUTPUT_DIR / "global_heatmap.html"
    latest_col = build_latest_heatmap(df, heatmap_path)

    print("\nPipeline complete")
    print(f"Country: {args.country}")
    print(f"Selected model: {model_bundle.name}")
    print(f"Holdout MAE (selection): {holdout_mae:.2f}")
    print(
        "Metrics | "
        f"MAE: {metrics['mae']:.2f}, "
        f"RMSE: {metrics['rmse']:.2f}, "
        f"MAPE: {metrics['mape']:.2f}%"
    )
    print(f"Forecast CSV: {forecast_csv}")
    print(f"Forecast plot: {plot_path}")
    print(f"Global heatmap ({latest_col}): {heatmap_path}")


if __name__ == "__main__":
    main()
