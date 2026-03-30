# Epidemic_Spread_Prediction

Modular live-style COVID epidemic prediction project with separate files for each feature.

## What this project now includes

1. Data loading from local CSV.
2. Optional live refresh from Johns Hopkins GitHub data.
3. Country-level feature engineering (lags, rolling means, growth rate).
4. Model training and automatic model selection.
5. Evaluation metrics (MAE, RMSE, MAPE).
6. Recursive forecasting for future days.
7. Forecast plot export (PNG).
8. Global heatmap export (HTML).

## Project structure

1. `epidemic_pipeline/config.py` - constants and default settings.
2. `epidemic_pipeline/data.py` - data download/load and country time-series builder.
3. `epidemic_pipeline/features.py` - feature engineering functions.
4. `epidemic_pipeline/model.py` - train/test split and model selection.
5. `epidemic_pipeline/evaluate.py` - regression metrics.
6. `epidemic_pipeline/forecast.py` - recursive future forecasting.
7. `epidemic_pipeline/visualize.py` - forecast plot saving.
8. `epidemic_pipeline/heatmap.py` - global heatmap creation.
9. `run_live_pipeline.py` - one-command pipeline runner.
10. `run_batch_forecasts.py` - run top-N country forecasts in one command.
11. `app.py` - Streamlit live dashboard.
12. `schedule_daily.sh` - daily automation runner.
13. `setup_cron.sh` - install a daily cron schedule.

## Install

```bash
python3 -m pip install --user -r requirements.txt
```

## Run (local data)

```bash
python3 run_live_pipeline.py --country India --forecast-days 30
```

## Run (refresh latest live data first)

```bash
python3 run_live_pipeline.py --country India --forecast-days 30 --refresh-data
```

## Output files

Files are generated in `outputs/`:

1. `forecast_india.csv` - next N-day forecast values.
2. `forecast_plot_india.png` - actual vs forecast trend chart.
3. `global_heatmap.html` - interactive world heatmap.

Open HTML/PNG directly in VS Code to view visuals.

## Batch run (top countries)

```bash
python3 run_batch_forecasts.py --top-n 20 --forecast-days 14
```

This creates per-country forecast CSVs in `outputs/batch/` and summary file:

1. `outputs/batch_summary.csv`

## Live dashboard

```bash
streamlit run app.py
```

Use the dashboard button to run the latest pipeline, inspect forecast table, trend chart, and batch summary.

## Daily scheduler

1. Run once manually:

```bash
./schedule_daily.sh
```

2. Install cron job (runs daily at 06:00):

```bash
./setup_cron.sh
```