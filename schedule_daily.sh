#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p outputs/logs

# Daily run with latest downloaded data
python3 run_live_pipeline.py --country India --forecast-days 30 --refresh-data \
  > "outputs/logs/daily_run_$(date +%F).log" 2>&1

echo "Daily run complete. Log saved in outputs/logs/."
