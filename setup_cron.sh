#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
CRON_CMD="0 6 * * * cd ${PROJECT_DIR} && /usr/bin/env bash schedule_daily.sh"

( crontab -l 2>/dev/null; echo "$CRON_CMD" ) | crontab -

echo "Cron job installed: runs daily at 06:00"
