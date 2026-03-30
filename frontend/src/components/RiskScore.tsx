import "../styles/RiskScore.css";

interface RiskScoreProps {
  level: string;
  currentCases: number;
  growthRate: number;
  predictedCases30d: number;
}

export function RiskScore({
  level,
  currentCases,
  growthRate,
  predictedCases30d,
}: RiskScoreProps) {
  const getRiskColor = () => {
    switch (level) {
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

  const getCaseChange = () => {
    const change = ((predictedCases30d - currentCases) / currentCases) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  return (
    <div className="risk-score-container">
      <div className="risk-header">
        <h2>Risk Assessment</h2>
      </div>

      <div className="risk-badge" style={{ borderColor: getRiskColor() }}>
        <div className="risk-level-text">Risk Level</div>
        <div className="risk-level-badge" style={{ backgroundColor: getRiskColor() }}>
          {level}
        </div>
      </div>

      <div className="risk-details">
        <div className="risk-detail-item">
          <span className="detail-icon">🦠</span>
          <div className="detail-content">
            <span className="detail-label">Current Cases</span>
            <span className="detail-value">{currentCases.toLocaleString()}</span>
          </div>
        </div>

        <div className="risk-detail-item">
          <span className="detail-icon">{growthRate > 0 ? "📈" : "📉"}</span>
          <div className="detail-content">
            <span className="detail-label">7-Day Growth Rate</span>
            <span className="detail-value">{growthRate.toFixed(2)}%</span>
          </div>
        </div>

        <div className="risk-detail-item">
          <span className="detail-icon">🔮</span>
          <div className="detail-content">
            <span className="detail-label">30-Day Prediction</span>
            <span className="detail-value">{predictedCases30d.toLocaleString()}</span>
          </div>
        </div>

        <div className="risk-detail-item">
          <span className="detail-icon">💹</span>
          <div className="detail-content">
            <span className="detail-label">Expected Change</span>
            <span className="detail-value">{getCaseChange()}</span>
          </div>
        </div>
      </div>

      <div className="risk-timeline">
        <div className="timeline-item">
          <div className="timeline-dot" style={{ backgroundColor: "#561C24" }}></div>
          <span>Now</span>
        </div>
        <div className="timeline-progress"></div>
        <div className="timeline-item">
          <div className="timeline-dot" style={{ backgroundColor: getRiskColor() }}></div>
          <span>Day 30</span>
        </div>
      </div>

      <div className="risk-recommendation">
        {level === "High" && (
          <div className="recommendation high">
            ⚠️ <strong>High Risk:</strong> Immediate preventive measures recommended
          </div>
        )}
        {level === "Medium" && (
          <div className="recommendation medium">
            ⚡ <strong>Medium Risk:</strong> Monitor closely and maintain precautions
          </div>
        )}
        {level === "Low" && (
          <div className="recommendation low">
            ✅ <strong>Low Risk:</strong> Continue standard health protocols
          </div>
        )}
      </div>
    </div>
  );
}
