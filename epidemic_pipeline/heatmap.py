from __future__ import annotations

from pathlib import Path
import warnings

import pandas as pd
import plotly.express as px
import pycountry


def _iso3(country_name: str):
    try:
        return pycountry.countries.lookup(country_name).alpha_3
    except LookupError:
        return None


def build_latest_heatmap(df: pd.DataFrame, output_html: Path):
    warnings.simplefilter(action="ignore", category=pd.errors.PerformanceWarning)
    grouped = df.groupby("Country/Region", as_index=False).sum(numeric_only=True)

    latest_col = grouped.columns[-1]
    heatmap_df = grouped[["Country/Region", latest_col]].copy()
    heatmap_df.columns = ["Country", "Cases"]

    heatmap_df["Country"] = heatmap_df["Country"].replace(
        {
            "US": "United States",
            "Korea, South": "South Korea",
            "Russia": "Russian Federation",
        }
    )

    heatmap_df["ISO3"] = heatmap_df["Country"].apply(_iso3)
    heatmap_df = heatmap_df.dropna(subset=["ISO3"])

    fig = px.choropleth(
        heatmap_df,
        locations="ISO3",
        color="Cases",
        hover_name="Country",
        color_continuous_scale="Reds",
        title=f"COVID-19 Global Cases Heatmap ({latest_col})",
    )

    output_html.parent.mkdir(parents=True, exist_ok=True)
    fig.write_html(str(output_html), include_plotlyjs="cdn")
    return latest_col
