import pandas as pd
import plotly.express as px
import pycountry
import warnings

# OPTIONAL: Hide fragmentation warning (safe)
warnings.simplefilter(action='ignore', category=pd.errors.PerformanceWarning)

# STEP 1: Load dataset
df = pd.read_csv("time_series_covid19_confirmed_global.csv")

# STEP 2: Group by country (optimized)
df = df.groupby("Country/Region", as_index=False).sum()

# STEP 3: Defragment dataframe
df = df.copy()

# STEP 4: Drop unnecessary columns
df = df.drop(columns=["Lat", "Long"], errors="ignore")

# STEP 5: Get latest date column
latest_date = df.columns[-1]

# STEP 6: Create clean dataframe
heatmap_df = df[["Country/Region", latest_date]].copy()
heatmap_df.columns = ["Country", "Cases"]

# STEP 7: Fix country names (important for ISO mapping)
heatmap_df["Country"] = heatmap_df["Country"].replace({
    "US": "United States",
    "Korea, South": "South Korea",
    "Russia": "Russian Federation"
})

# STEP 8: Convert Country → ISO-3
def get_iso3(country_name):
    try:
        return pycountry.countries.lookup(country_name).alpha_3
    except:
        return None

heatmap_df["ISO_Code"] = heatmap_df["Country"].apply(get_iso3)

# STEP 9: Remove rows where ISO code not found
heatmap_df = heatmap_df.dropna(subset=["ISO_Code"])

# STEP 10: Create heatmap
fig = px.choropleth(
    heatmap_df,
    locations="ISO_Code",
    color="Cases",
    hover_name="Country",
    color_continuous_scale="Reds",
    title=f"COVID-19 Global Spread ({latest_date})"
)

# STEP 11: Show map
fig.show()