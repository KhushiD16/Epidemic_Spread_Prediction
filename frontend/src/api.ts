// API Configuration
const API_BASE_URL = "http://localhost:8000";

export interface PredictionData {
  date: string;
  predicted_cases: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface CountryPrediction {
  country: string;
  forecast_days: number;
  current_cases: number;
  predicted_cases_30d: number;
  growth_rate: number;
  risk_score: string;
  predictions: PredictionData[];
}

export interface HeatmapPoint {
  region: string;
  cases: number;
  risk_level: string;
  risk_score: number;
  latitude: number;
  longitude: number;
}

export interface RiskAssessment {
  country: string;
  risk_level: string;
  risk_score: number;
  color: string;
  trend: string;
}

// API Functions
export const getAvailableCountries = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/countries`);
  const data = await response.json();
  return data.countries;
};

export const getPrediction = async (
  country: string,
  forecastDays: number = 30,
  refreshData: boolean = false
): Promise<CountryPrediction> => {
  const params = new URLSearchParams({
    country,
    forecast_days: forecastDays.toString(),
    refresh_data: refreshData.toString(),
  });
  const response = await fetch(
    `${API_BASE_URL}/predict?${params}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch prediction: ${response.statusText}`);
  }
  return response.json();
};

export const getHeatmap = async (
  country: string = "India"
): Promise<HeatmapPoint[]> => {
  const response = await fetch(`${API_BASE_URL}/heatmap?country=${country}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch heatmap: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
};

export const getRiskAssessment = async (
  topN: number = 10
): Promise<RiskAssessment[]> => {
  const response = await fetch(`${API_BASE_URL}/risk-assessment?top_n=${topN}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch risk assessment: ${response.statusText}`);
  }
  const data = await response.json();
  return data.assessments;
};

export const getStatistics = async () => {
  const response = await fetch(`${API_BASE_URL}/statistics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch statistics: ${response.statusText}`);
  }
  return response.json();
};
