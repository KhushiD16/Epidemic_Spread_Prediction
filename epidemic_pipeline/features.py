from __future__ import annotations

import numpy as np
import pandas as pd


def add_features(ts: pd.DataFrame) -> pd.DataFrame:
    """Create lag and trend features for cumulative case forecasting."""
    df = ts.copy()
    df["DayIndex"] = np.arange(len(df))
    df["Lag1"] = df["Cases"].shift(1)
    df["Lag7"] = df["Cases"].shift(7)
    df["RollMean7"] = df["Cases"].rolling(7).mean()
    df["RollMean14"] = df["Cases"].rolling(14).mean()
    df["GrowthRate1"] = df["Cases"].pct_change().replace([np.inf, -np.inf], 0)
    df["GrowthRate1"] = df["GrowthRate1"].fillna(0)
    return df


def model_columns() -> list[str]:
    return ["DayIndex", "Lag1", "Lag7", "RollMean7", "RollMean14", "GrowthRate1"]


def training_frame(feature_df: pd.DataFrame) -> pd.DataFrame:
    cols = model_columns() + ["Cases", "Date"]
    return feature_df[cols].dropna().reset_index(drop=True)
