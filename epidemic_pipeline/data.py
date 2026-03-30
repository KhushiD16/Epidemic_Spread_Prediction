from __future__ import annotations

from pathlib import Path

import pandas as pd


def download_latest_dataset(url: str, output_path: Path) -> Path:
    """Download the latest dataset from a URL and save it to output_path."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(url)
    df.to_csv(output_path, index=False)
    return output_path


def load_dataset(csv_path: Path) -> pd.DataFrame:
    """Load the global confirmed cases CSV."""
    return pd.read_csv(csv_path)


def build_country_timeseries(df: pd.DataFrame, country: str) -> pd.DataFrame:
    """Return country-level daily cumulative and new-case time series."""
    grouped = df.groupby("Country/Region").sum(numeric_only=True)
    if country not in grouped.index:
        raise ValueError(f"Country '{country}' not found in dataset")

    series = grouped.loc[country]

    # Keep only date columns and convert to datetime index.
    date_index = pd.to_datetime(series.index, format="mixed", errors="coerce")
    ts = pd.DataFrame({"Date": date_index, "Cases": series.values})
    ts = ts.dropna(subset=["Date"]).sort_values("Date").reset_index(drop=True)

    ts["Cases"] = ts["Cases"].astype(float)
    ts["NewCases"] = ts["Cases"].diff().fillna(ts["Cases"])
    ts["NewCases"] = ts["NewCases"].clip(lower=0)
    return ts
