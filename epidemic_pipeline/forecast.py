from __future__ import annotations

from datetime import timedelta

import pandas as pd

from .features import add_features, model_columns


def recursive_forecast(history_ts: pd.DataFrame, model, days: int) -> pd.DataFrame:
    """Forecast cumulative cases recursively for the requested number of days."""
    working = history_ts[["Date", "Cases"]].copy().reset_index(drop=True)

    for _ in range(days):
        feat_df = add_features(working)
        next_day = working["Date"].iloc[-1] + timedelta(days=1)
        next_index = len(working)

        # Build the next-row features from current history.
        lag1 = working["Cases"].iloc[-1]
        lag7 = working["Cases"].iloc[-7] if len(working) >= 7 else working["Cases"].iloc[0]
        roll7 = working["Cases"].tail(7).mean()
        roll14 = working["Cases"].tail(14).mean() if len(working) >= 14 else working["Cases"].mean()
        prev = working["Cases"].iloc[-2] if len(working) >= 2 else working["Cases"].iloc[-1]
        growth = (lag1 - prev) / prev if prev > 0 else 0.0

        row = pd.DataFrame(
            {
                "DayIndex": [next_index],
                "Lag1": [lag1],
                "Lag7": [lag7],
                "RollMean7": [roll7],
                "RollMean14": [roll14],
                "GrowthRate1": [growth],
            }
        )

        pred = float(model.predict(row[model_columns()])[0])
        pred = max(pred, lag1)

        working = pd.concat(
            [working, pd.DataFrame({"Date": [next_day], "Cases": [pred]})],
            ignore_index=True,
        )

    return working.tail(days).reset_index(drop=True)
