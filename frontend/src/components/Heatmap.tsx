import type { HeatmapPoint } from "../api";
import "../styles/Heatmap.css";

interface HeatmapProps {
  data: HeatmapPoint[];
  country: string;
}

export function Heatmap({ data, country }: HeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h2>Risk Heatmap: {country}</h2>
        </div>
        <div className="heatmap-empty">No data available</div>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "#FF6B6B";
      case "Medium":
        return "#FFD700";
      case "Low":
        return "#90EE90";
      default:
        return "#808080";
    }
  };

  // Sort by risk level (High > Medium > Low)
  const riskOrder = { High: 3, Medium: 2, Low: 1 };
  const sortedData = [...data].sort(
    (a, b) =>
      (riskOrder[b.risk_level as keyof typeof riskOrder] || 0) -
      (riskOrder[a.risk_level as keyof typeof riskOrder] || 0)
  );

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h2>Risk Heatmap: {country}</h2>
        <p className="heatmap-subtitle">Regional Risk Distribution</p>
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-circle" style={{ backgroundColor: "#90EE90" }}></div>
          <span>Low Risk</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle" style={{ backgroundColor: "#FFD700" }}></div>
          <span>Medium Risk</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle" style={{ backgroundColor: "#FF6B6B" }}></div>
          <span>High Risk</span>
        </div>
      </div>

      <div className="heatmap-grid">
        {sortedData.map((region) => (
          <div
            key={region.region}
            className="heatmap-cell"
            style={{
              backgroundColor: getRiskColor(region.risk_level),
              borderColor: getRiskColor(region.risk_level),
            }}
          >
            <div className="cell-region">{region.region}</div>
            <div className="cell-cases">{region.cases.toLocaleString()}</div>
            <div className="cell-risk">{region.risk_level}</div>
            <div className="cell-score">
              {(region.risk_score * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      <div className="heatmap-stats">
        <div className="stat-box">
          <span className="stat-label">Total Regions</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">High Risk Regions</span>
          <span className="stat-value" style={{ color: "#FF6B6B" }}>
            {data.filter((r) => r.risk_level === "High").length}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Cases (All Regions)</span>
          <span className="stat-value">
            {data
              .reduce((sum, r) => sum + r.cases, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
