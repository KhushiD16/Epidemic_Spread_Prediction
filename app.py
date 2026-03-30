from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

from epidemic_pipeline.config import DEFAULT_COUNTRY, DEFAULT_FORECAST_DAYS

st.set_page_config(page_title="Epidemic Live Predictor", layout="wide")
st.title("Epidemic Spread Prediction Dashboard")

st.write("Run daily-style forecasting and inspect forecast files and charts.")

left, right = st.columns(2)
with left:
    country = st.text_input("Country", value=DEFAULT_COUNTRY)
    forecast_days = st.slider("Forecast days", min_value=7, max_value=90, value=DEFAULT_FORECAST_DAYS)
with right:
    refresh_data = st.checkbox("Refresh latest data before run", value=False)

if st.button("Run Forecast Pipeline", type="primary"):
    cmd = [sys.executable, "run_live_pipeline.py", "--country", country, "--forecast-days", str(forecast_days)]
    if refresh_data:
        cmd.append("--refresh-data")

    with st.spinner("Running pipeline..."):
        result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        st.success("Pipeline completed")
    else:
        st.error("Pipeline failed")

    if result.stdout:
        st.code(result.stdout)
    if result.stderr:
        st.code(result.stderr)

safe_country = country.lower().replace(" ", "_")
forecast_csv = Path("outputs") / f"forecast_{safe_country}.csv"
forecast_plot = Path("outputs") / f"forecast_plot_{safe_country}.png"
heatmap_html = Path("outputs") / "global_heatmap.html"
batch_summary = Path("outputs") / "batch_summary.csv"

st.subheader("Latest country forecast")
if forecast_csv.exists():
    df_forecast = pd.read_csv(forecast_csv)
    st.dataframe(df_forecast, width="stretch")
    st.line_chart(df_forecast.set_index("Date")["Cases"])
    st.download_button(
        "Download latest country forecast CSV",
        data=forecast_csv.read_bytes(),
        file_name=forecast_csv.name,
        mime="text/csv",
    )
else:
    st.info("No forecast file found yet. Run the pipeline first.")

st.subheader("Forecast plot image")
if forecast_plot.exists():
    st.image(str(forecast_plot), caption=forecast_plot.name, width="stretch")
else:
    st.info("No forecast image found yet.")

st.subheader("Global heatmap")
if heatmap_html.exists():
    with heatmap_html.open("r", encoding="utf-8") as f:
        heatmap_content = f.read()
    components.html(heatmap_content, height=650, scrolling=True)
else:
    st.info("No heatmap html found yet.")

st.subheader("Batch summary (if batch run executed)")
if batch_summary.exists():
    summary_df = pd.read_csv(batch_summary)
    st.dataframe(summary_df, width="stretch")

    if "forecast_file" in summary_df.columns:
        existing_files = []
        for fp in summary_df["forecast_file"].dropna().tolist():
            path_obj = Path(fp)
            if path_obj.exists():
                existing_files.append(path_obj)

        if existing_files:
            selected_file = st.selectbox(
                "Open a batch forecast file",
                options=existing_files,
                format_func=lambda p: p.name,
            )

            selected_df = pd.read_csv(selected_file)
            st.dataframe(selected_df, width="stretch")
            st.download_button(
                "Download selected batch forecast CSV",
                data=selected_file.read_bytes(),
                file_name=selected_file.name,
                mime="text/csv",
            )
        else:
            st.info("Batch summary exists, but forecast files were not found on disk.")
else:
    st.info("No batch summary found yet.")
