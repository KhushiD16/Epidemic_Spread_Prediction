from pathlib import Path

RAW_DATA_PATH = Path("time_series_covid19_confirmed_global.csv")
OUTPUT_DIR = Path("outputs")

# Johns Hopkins CSSE COVID-19 global confirmed cases time series
JHU_CONFIRMED_URL = (
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/"
    "csse_covid_19_data/csse_covid_19_time_series/"
    "time_series_covid19_confirmed_global.csv"
)

DEFAULT_COUNTRY = "India"
DEFAULT_FORECAST_DAYS = 30
DEFAULT_TEST_SIZE = 0.2
