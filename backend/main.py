from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import os
import sys
from datetime import datetime, timedelta

# Add parent directory to path for imports
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, project_root)
sys.path.insert(0, backend_dir)

# Import epidemic pipeline functions
try:
    from epidemic_pipeline.data import load_dataset, build_country_timeseries
    from epidemic_pipeline.features import add_features
    from epidemic_pipeline.forecast import recursive_forecast
    from epidemic_pipeline.model import fit_and_select_model
except ImportError as e:
    print(f"Info: Epidemic pipeline not imported here (will be imported as needed): {e}")

# ============= APP Lifespan =============
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Epidemic Spread Prediction API...")
    print(f"Loading data from CSV...")
    load_data()
    if df_global is not None:
        print(f"✓ Successfully loaded {len(countries_list)} countries from CSV")
    else:
        print("⚠ Running with demo/fallback data")
    yield
    # Shutdown
    print("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Epidemic Spread Prediction API",
    description="COVID-19 spread prediction using ML forecasting",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= Pydantic Models =============
class PredictionData(BaseModel):
    date: str
    confirmed_cases: int
    predicted_cases: int

class CountryPrediction(BaseModel):
    country: str
    current_cases: int
    predicted_cases_30d: int
    growth_rate: float
    risk_score: str
    predictions: List[PredictionData]

class HeatmapData(BaseModel):
    region: str
    cases: int
    deaths: int
    risk_level: str

class HeatmapResponse(BaseModel):
    country: str
    total_cases: int
    total_deaths: int
    data: List[HeatmapData]

class RiskAssessment(BaseModel):
    country: str
    current_risk_level: str
    trend: str
    recommendations: List[str]
    key_metrics: dict

class Statistics(BaseModel):
    total_countries: int
    most_affected: str
    highest_growth_rate_country: str
    last_updated: str

# ============= Global State =============
df_global = None
countries_list = []
cached_predictions = {}

# ============= Helper Functions =============
def load_data():
    """Load COVID-19 data from CSV"""
    global df_global, countries_list
    
    csv_path = os.path.join(project_root, "time_series_covid19_confirmed_global.csv")
    
    try:
        # Try to use epidemic_pipeline loader
        from epidemic_pipeline.data import load_dataset
        df_global = load_dataset(csv_path)
        print(f"✓ Loaded data using epidemic_pipeline from {csv_path}")
    except Exception as e:
        print(f"Fallback: Loading CSV directly - {e}")
        # Fallback: Load CSV directly
        if os.path.exists(csv_path):
            df_global = pd.read_csv(csv_path)
            print(f"✓ Loaded CSV directly from {csv_path}")
        else:
            # Use demo data if CSV not found
            print(f"⚠ CSV not found at {csv_path}, using demo data")
            return None
    
    # Get unique countries
    if 'Country/Region' in df_global.columns:
        countries_list = sorted(df_global['Country/Region'].unique().tolist())
    elif 'Country_Region' in df_global.columns:
        countries_list = sorted(df_global['Country_Region'].unique().tolist())
    else:
        countries_list = []
    
    return df_global

def get_country_timeseries(country: str) -> Optional[pd.Series]:
    """Get time series data for a specific country"""
    global df_global
    
    if df_global is None:
        return None
    
    try:
        # Try using epidemic_pipeline function
        from epidemic_pipeline.data import build_country_timeseries
        ts = build_country_timeseries(df_global, country)
        return ts
    except Exception as e:
        print(f"Fallback: Building timeseries manually - {e}")
        # Fallback: Build manually
        if 'Country/Region' in df_global.columns:
            country_col = 'Country/Region'
        elif 'Country_Region' in df_global.columns:
            country_col = 'Country_Region'
        else:
            return None
        
        country_data = df_global[df_global[country_col] == country]
        
        # Sum across all provinces/states
        numeric_cols = country_data.select_dtypes(include=[np.number]).columns
        ts = country_data[numeric_cols].sum()
        
        return ts

def calculate_risk_score(growth_rate: float) -> str:
    """Determine risk level based on growth rate"""
    if growth_rate > 5:
        return "High"
    elif growth_rate > 2:
        return "Medium"
    else:
        return "Low"

def generate_30day_forecast(ts: pd.DataFrame, cases_series: np.ndarray) -> List[PredictionData]:
    """Generate 30-day forecast"""
    predictions = []
    
    if cases_series is None or len(cases_series) == 0:
        return predictions
    
    # Get recent data (last 30 days)
    recent_values = cases_series[-30:].astype(float) if len(cases_series) >= 30 else cases_series.astype(float)
    
    # Simple exponential smoothing forecast
    if len(recent_values) >= 7:
        # Calculate growth rates
        growth_rates = []
        for i in range(1, len(recent_values)):
            if recent_values[i-1] > 0:
                growth = (recent_values[i] - recent_values[i-1]) / recent_values[i-1]
                growth_rates.append(max(0, growth))  # Prevent negative growth
        
        avg_growth = np.mean(growth_rates) if growth_rates else 0.01
    else:
        avg_growth = 0.01
    
    # Generate forecast
    last_value = recent_values[-1] if len(recent_values) > 0 else 1000
    start_date = datetime.now()
    
    current_cases_base = int(cases_series[-1]) if len(cases_series) > 0 else 0
    
    for i in range(1, 31):
        forecast_value = last_value * ((1 + avg_growth) ** i)
        pred_date = start_date + timedelta(days=i)
        
        predictions.append(PredictionData(
            date=pred_date.strftime("%Y-%m-%d"),
            confirmed_cases=current_cases_base,
            predicted_cases=int(forecast_value)
        ))
    
    return predictions

# ============= API Endpoints =============

@app.get("/health")
async def health_check():
    """Health check endpoint - triggers data loading on first call"""
    global df_global
    if df_global is None:
        load_data()
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_loaded": df_global is not None,
        "countries_available": len(countries_list)
    }

@app.get("/countries")
async def get_countries():
    """Get list of available countries"""
    global countries_list, df_global
    
    # If countries_list is still empty, try loading data now
    if not countries_list:
        load_data()
    
    if not countries_list:
        # Return demo countries if data still not loaded
        return {"countries": ["India", "USA", "Brazil", "United Kingdom", "France", "Germany"]}
    
    return {"countries": countries_list}

@app.get("/predict/{country}", response_model=CountryPrediction)
async def predict(country: str):
    """Get predictions for a specific country"""
    
    # Get timeseries
    ts = get_country_timeseries(country)
    
    if ts is None or len(ts) == 0:
        raise HTTPException(status_code=404, detail=f"No data found for {country}")
    
    # Extract cases column (ts is a DataFrame from build_country_timeseries)
    if isinstance(ts, pd.DataFrame):
        if 'Cases' in ts.columns:
            cases_series = ts['Cases'].values.astype(float)
        else:
            # Fallback: get numeric columns
            numeric_cols = ts.select_dtypes(include=[np.number]).columns
            cases_series = ts[numeric_cols[-1]].values.astype(float) if len(numeric_cols) > 0 else np.array([])
    else:
        cases_series = ts.values.astype(float)
    
    if len(cases_series) == 0:
        raise HTTPException(status_code=400, detail=f"No valid case data for {country}")
    
    # Calculate metrics
    recent_values = cases_series[-30:] if len(cases_series) >= 30 else cases_series
    current_cases = int(cases_series[-1])
    
    # Calculate growth rate
    if len(cases_series) >= 7:
        first_week_avg = np.mean(cases_series[:7])
        last_week_avg = np.mean(cases_series[-7:])
        if first_week_avg > 0:
            growth_rate = ((last_week_avg - first_week_avg) / first_week_avg) * 100
        else:
            growth_rate = 0
    else:
        growth_rate = 0
    
    # Generate forecast
    forecast = generate_30day_forecast(ts, cases_series)
    predicted_30d = forecast[-1].predicted_cases if forecast else current_cases
    
    # Determine risk
    risk_score = calculate_risk_score(growth_rate / 100) if growth_rate >= 0 else "Low"
    
    return CountryPrediction(
        country=country,
        current_cases=current_cases,
        predicted_cases_30d=predicted_30d,
        growth_rate=round(growth_rate, 2),
        risk_score=risk_score,
        predictions=forecast
    )

@app.get("/heatmap/{country}", response_model=HeatmapResponse)
async def get_heatmap(country: str):
    """Get regional heatmap data"""
    
    if df_global is None:
        # Return demo data for India
        if country.lower() == "india":
            return HeatmapResponse(
                country="India",
                total_cases=45230000,
                total_deaths=527000,
                data=[
                    HeatmapData(region="Maharashtra", cases=8500000, deaths=140000, risk_level="High"),
                    HeatmapData(region="Tamil Nadu", cases=7200000, deaths=120000, risk_level="High"),
                    HeatmapData(region="Karnataka", cases=4500000, deaths=95000, risk_level="Medium"),
                    HeatmapData(region="Uttar Pradesh", cases=3800000, deaths=70000, risk_level="Medium"),
                    HeatmapData(region="Delhi", cases=2100000, deaths=45000, risk_level="Medium"),
                    HeatmapData(region="Bihar", cases=1900000, deaths=35000, risk_level="Low"),
                    HeatmapData(region="Rajasthan", cases=1200000, deaths=25000, risk_level="Low"),
                    HeatmapData(region="Gujarat", cases=980000, deaths=18000, risk_level="Low"),
                    HeatmapData(region="Telangana", cases=750000, deaths=15000, risk_level="Low"),
                    HeatmapData(region="West Bengal", cases=620000, deaths=12000, risk_level="Low"),
                ]
            )
        else:
            return HeatmapResponse(
                country=country,
                total_cases=1000000,
                total_deaths=20000,
                data=[]
            )
    
    # Get country data with provinces
    try:
        if 'Country/Region' in df_global.columns:
            country_col = 'Country/Region'
            province_col = 'Province/State'
        else:
            country_col = 'Country_Region'
            province_col = 'Province_State'
        
        country_data = df_global[df_global[country_col] == country]
        
        if len(country_data) == 0:
            raise HTTPException(status_code=404, detail=f"No data for {country}")
        
        total_cases = 0
        total_deaths = 0
        heatmap_data = []
        
        # Get numeric columns (dates)
        numeric_cols = country_data.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) > 0:
            latest_col = numeric_cols[-1]
            
            for idx, row in country_data.iterrows():
                province = row.get(province_col, "Unknown")
                # Handle NaN or None province names
                if pd.isna(province) or province is None or province == "":
                    province = "Unknown Region"
                else:
                    province = str(province)
                    
                cases = int(row[latest_col])
                total_cases += cases
                
                # Simplistic death calculation (assume 2% death rate)
                deaths = int(cases * 0.02)
                total_deaths += deaths
                
                # Risk level based on cases
                if cases > 1000000:
                    risk = "High"
                elif cases > 100000:
                    risk = "Medium"
                else:
                    risk = "Low"
                
                heatmap_data.append(HeatmapData(
                    region=province,
                    cases=cases,
                    deaths=deaths,
                    risk_level=risk
                ))
        
        return HeatmapResponse(
            country=country,
            total_cases=total_cases,
            total_deaths=total_deaths,
            data=heatmap_data[:20]  # Top 20 regions
        )
    
    except Exception as e:
        print(f"Heatmap error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/risk-assessment/{country}", response_model=RiskAssessment)
async def get_risk_assessment(country: str):
    """Get detailed risk assessment"""
    
    try:
        # Get prediction to understand risk
        pred = await predict(country)
        
        # Determine trend
        if pred.growth_rate > 3:
            trend = "Increasing"
            recommendation = "⚠️ Rising case numbers - Increase testing and isolation measures"
        elif pred.growth_rate > 0:
            trend = "Slowly Increasing"
            recommendation = "Monitor closely - Consider strengthening precautions"
        elif pred.growth_rate == 0:
            trend = "Stable"
            recommendation = "Maintain current preventive measures"
        else:
            trend = "Declining"
            recommendation = "✓ Positive trend - Continue vaccination and monitoring"
        
        return RiskAssessment(
            country=country,
            current_risk_level=pred.risk_score,
            trend=trend,
            recommendations=[
                recommendation,
                "Ensure vaccination campaigns are active",
                "Monitor for new variants",
                "Maintain healthcare system preparedness"
            ],
            key_metrics={
                "current_cases": pred.current_cases,
                "30day_forecast": pred.predicted_cases_30d,
                "growth_rate": pred.growth_rate,
                "risk_score": pred.risk_score
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/statistics", response_model=Statistics)
async def get_statistics():
    """Get global statistics"""
    
    try:
        most_affected = None
        highest_growth = None
        max_cases = 0
        max_growth = -100
        
        # Analyze each country (limit to top 50)
        for country in countries_list[:50]:
            ts = get_country_timeseries(country)
            if ts is not None and len(ts) >= 7:
                cases = int(ts.iloc[-1])
                recent = ts.tail(7).values.astype(float)
                
                if cases > max_cases:
                    max_cases = cases
                    most_affected = country
                
                if len(recent) >= 2 and recent[0] > 0:
                    growth = (recent[-1] - recent[0]) / recent[0]
                    if growth > max_growth:
                        max_growth = growth
                        highest_growth = country
        
        return Statistics(
            total_countries=len(countries_list),
            most_affected=most_affected or "Unknown",
            highest_growth_rate_country=highest_growth or "Unknown",
            last_updated=datetime.now().isoformat()
        )
    except Exception as e:
        print(f"Statistics error: {e}")
        return Statistics(
            total_countries=len(countries_list),
            most_affected="India",
            highest_growth_rate_country="Brazil",
            last_updated=datetime.now().isoformat()
        )

class GlobalCountryData(BaseModel):
    country: str
    current_cases: int
    risk_level: str
    growth_rate: float

class GlobalHeatmapResponse(BaseModel):
    total_countries: int
    timestamp: str
    countries: List[GlobalCountryData]

@app.get("/global-heatmap", response_model=GlobalHeatmapResponse)
async def get_global_heatmap():
    """Get risk heatmap for all countries"""
    countries_data = []
    
    # Limit to first 100 countries for performance
    for country in countries_list[:100]:
        try:
            pred = await predict(country)
            countries_data.append(GlobalCountryData(
                country=pred.country,
                current_cases=pred.current_cases,
                risk_level=pred.risk_score,
                growth_rate=pred.growth_rate
            ))
        except Exception as e:
            print(f"Error processing {country}: {e}")
            continue
    
    return GlobalHeatmapResponse(
        total_countries=len(countries_data),
        timestamp=datetime.now().isoformat(),
        countries=countries_data
    )

@app.get("/")
async def root():
    """API documentation"""
    return {
        "title": "Epidemic Spread Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "countries": "/countries",
            "predict": "/predict/{country}",
            "heatmap": "/heatmap/{country}",
            "global-heatmap": "/global-heatmap",
            "risk_assessment": "/risk-assessment/{country}",
            "statistics": "/statistics",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
