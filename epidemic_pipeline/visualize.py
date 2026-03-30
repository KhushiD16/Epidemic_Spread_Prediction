from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt


def save_country_and_forecast_plot(actual_df, forecast_df, country: str, output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(12, 6))
    plt.plot(actual_df["Date"], actual_df["Cases"], label="Actual cumulative cases")
    plt.plot(
        forecast_df["Date"],
        forecast_df["Cases"],
        linestyle="--",
        label="Forecast cumulative cases",
    )
    plt.title(f"COVID-19 Spread Forecast - {country}")
    plt.xlabel("Date")
    plt.ylabel("Cases")
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=160)
    plt.close()
