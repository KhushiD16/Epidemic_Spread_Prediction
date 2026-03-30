import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { PredictionData } from "../api";
import "../styles/Charts.css";

interface PredictionChartProps {
  data: PredictionData[];
  country: string;
}

export function PredictionChart({ data, country }: PredictionChartProps) {
  // Format data for chart
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    predicted_cases: Math.round(point.predicted_cases),
    lower_bound: Math.round(point.lower_bound || 0),
    upper_bound: Math.round(point.upper_bound || 0),
  }));

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>30-Day Forecast: {country}</h2>
        <p className="chart-subtitle">Predicted COVID-19 Cases</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6D2932" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6D2932" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFD700" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#D3D3D3" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#666", fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: "#666", fontSize: 12 }}
            label={{ value: "Cases", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#561C24",
              border: "1px solid #6D2932",
              borderRadius: "8px",
              color: "#E8D8C4",
            }}
            cursor={{ fill: "rgba(109, 41, 50, 0.1)" }}
          />
          
          <Area
            type="monotone"
            dataKey="lower_bound"
            stroke="none"
            fillOpacity={0}
            name="Lower Bound"
          />
          <Area
            type="monotone"
            dataKey="predicted_cases"
            stroke="#6D2932"
            strokeWidth={3}
            fill="url(#colorPredicted)"
            name="Predicted Cases"
          />
          <Area
            type="monotone"
            dataKey="upper_bound"
            stroke="none"
            fillOpacity={0}
            name="Upper Bound"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-info">
        <div className="info-box">
          <span className="info-label">Peak Cases Expected:</span>
          <span className="info-value">
            {Math.max(...chartData.map((d) => d.predicted_cases)).toLocaleString()}
          </span>
        </div>
        <div className="info-box">
          <span className="info-label">Final Prediction (Day 30):</span>
          <span className="info-value">
            {chartData[chartData.length - 1]?.predicted_cases?.toLocaleString() || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
