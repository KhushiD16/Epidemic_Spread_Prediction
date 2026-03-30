import { useState, useEffect } from "react";
import "./App.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE_URL = "http://localhost:8000";

// SVG Icons Components
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="m4.502 1 2.596 2.596a.5.5 0 0 0 .706 0l2.596-2.596a.5.5 0 0 1 .707 0l2.596 2.596a.5.5 0 0 0 .707 0l2.596-2.596a.5.5 0 0 1 .707.707L14.207 4.5l2.596 2.596a.5.5 0 1 1-.707.707L13.5 5.207l-2.596 2.596a.5.5 0 0 1-.707 0L7.5 5.207 4.904 7.803a.5.5 0 1 1-.707-.707L6.793 4.5 4.207 1.914a.5.5 0 0 1 .707-.707z" clipRule="evenodd"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0l-5.5 9.428c-.5.899.233 2.042 1.24 2.042h11.04c1.007 0 1.74-1.143 1.24-2.042L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.293 1.035 3.071.063 5.108.057 7.169.627 9.1.67 9.23.69 9.47.69 10c0 .5.1 1.8 1 2.8.5.6 1.3 1.7 2.5 3 1.5 1.7 3 3.5 5 5.5 2-2 3.5-3.8 5-5.5 1.2-1.3 2-2.4 2.5-3 .9-1 1-2.3 1-2.8 0-.53-.02-.77-.063-.9-.568-1.931-.574-4.005.027-5.91.552-1.59 1.425-2.257 2.182-2.257.52 0 1.019.284 1.574.996l1.324 1.407-1.03 1.03c-.524.523-.927 1.079-.927 2.026 0 .55.458 1.033 1.033 1.033h.066c.546 0 1.033-.487 1.033-1.033 0-1.065.27-2.055.645-2.978.405-.926.935-1.800 1.831-2.058.667-.19 1.222-.066 1.666.237.444.305.722.77.722 1.271 0 .552-.458 1.033-1.033 1.033h-.066c-.546 0-1.033.487-1.033 1.033 0 1.065-.27 2.055-.645 2.978-.405.926-.935 1.800-1.831 2.058-.667.19-1.222.066-1.666-.237a1.72 1.72 0 0 1-.704-1.066l-1.323-1.406 1.03-1.03c.524-.523.927-1.079.927-2.026 0-.55-.458-1.033-1.033-1.033h-.066C12.487 7 12 7.487 12 8.033c0 1.065-.27 2.055-.645 2.978-.405.926-.935 1.800-1.831 2.058-.667.19-1.222.066-1.666-.237a1.72 1.72 0 0 1-.704-1.066l-1.323-1.406 1.03-1.03c.524-.523.927-1.079.927-2.026 0-.55-.458-1.033-1.033-1.033h-.066c-.546 0-1.033.487-1.033 1.033 0 1.065-.27 2.055-.645 2.978-.405.926-.935 1.800-1.831 2.058-.667.19-1.222.066-1.666-.237a1.72 1.72 0 0 1-.704-1.066L1.97 8.28l1.03-1.03c.524-.523.927-1.079.927-2.026 0-.55-.458-1.033-1.033-1.033h-.066C1.487 4 1 4.487 1 5.033c0 1.065-.27 2.055-.645 2.978-.405.926-.935 1.800-1.831 2.058-.667.19-1.222.066-1.666-.237a1.72 1.72 0 0 1-.704-1.066L-2.03 7.28l1.03-1.03z"/>
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.534 7h3.26a.5.5 0 0 1 .488.608l-.494 2.01a.5.5 0 0 1-.488.392h-.495a.5.5 0 0 0-.488.41l-.578 2.924a.5.5 0 0 1-.488.408H.5a.5.5 0 0 1-.488-.408l-.578-2.924A.5.5 0 0 0 0 9.618h-.495a.5.5 0 0 1-.488-.391l-.494-2.01a.5.5 0 0 1 .488-.609h3.26a.5.5 0 0 0 .488-.409l.578-2.924a.5.5 0 0 1 .488-.408h6.252a.5.5 0 0 1 .488.408l.578 2.924a.5.5 0 0 0 .488.409zm-11.738 5.468A.5.5 0 0 0 .5 14h13a.5.5 0 0 0 .488-.532l-.494-2.01a.5.5 0 0 0-.488-.408H.5a.5.5 0 0 0-.488.408l-.494 2.01z"/>
  </svg>
);

// Interfaces
interface PredictionData {
  date: string;
  confirmed_cases: number;
  predicted_cases: number;
}

interface CountryPrediction {
  country: string;
  current_cases: number;
  predicted_cases_30d: number;
  growth_rate: number;
  risk_score: string;
  predictions: PredictionData[];
}

interface HeatmapData {
  region: string;
  cases: number;
  deaths: number;
  risk_level: string;
}

interface HeatmapResponse {
  country: string;
  total_cases: number;
  total_deaths: number;
  data: HeatmapData[];
}

interface GlobalCountryData {
  country: string;
  current_cases: number;
  risk_level: string;
  growth_rate: number;
}

interface GlobalHeatmapResponse {
  total_countries: number;
  timestamp: string;
  countries: GlobalCountryData[];
}

function App() {
  const [country, setCountry] = useState<string>("India");
  const [countries, setCountries] = useState<string[]>([]);
  const [data, setData] = useState<CountryPrediction | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [globalHeatmap, setGlobalHeatmap] = useState<GlobalHeatmapResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/countries`);
        const data = await response.json();
        setCountries(data.countries);
      } catch {
        setError("Failed to load countries");
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const getPredictions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/predict/${country}`);
        const result = await response.json();
        setData(result);
        
        if (country === "India") {
          const heatmapResp = await fetch(`${API_BASE_URL}/heatmap/${country}`);
          setHeatmapData(await heatmapResp.json());
        }
      } catch {
        setError(`Failed to load data for ${country}`);
      } finally {
        setLoading(false);
      }
    };
    getPredictions();
  }, [country]);

  useEffect(() => {
    const getGlobalHeatmap = async () => {
      setLoadingGlobal(true);
      try {
        const response = await fetch(`${API_BASE_URL}/global-heatmap`);
        setGlobalHeatmap(await response.json());
      } catch {
        setError("Failed to load global data");
      } finally {
        setLoadingGlobal(false);
      }
    };
    getGlobalHeatmap();
  }, []);

  const getRiskColor = (risk: string): string => {
    const riskMap: Record<string, string> = {
      "High": "#FF6B6B",
      "Medium": "#FFD700",
      "Low": "#90EE90"
    };
    return riskMap[risk] || "#90EE90";
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a0e1e 0%, #2d1625 50%, #1a0e1e 100%)",
      color: "#E8D8C4",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Advanced Virus Particle Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 30% 20%, rgba(255,107,107,0.08) 0%, transparent 50%)"
      }}>
        {/* Large Neon Virus Particles with Spike Proteins */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`large-${i}`}
            style={{
              position: "absolute",
              width: `${140 + i * 40}px`,
              height: `${140 + i * 40}px`,
              animation: `float ${28 + i * 3}s ease-in-out infinite`,
              left: `${(i * 16) % 100}%`,
              top: `${(i * 15) % 100}%`,
              filter: "drop-shadow(0 0 40px rgba(255,107,107,${0.4 - i * 0.05}))"
            }}
          >
            {/* Virus Core with Gradient */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              background: `radial-gradient(circle at 40% 40%, rgba(255,182,193,${0.12 - i * 0.014}) 0%, rgba(255,107,107,${0.06 - i * 0.008}) 40%, transparent 75%)`,
              borderRadius: "50%",
              border: `3px solid rgba(255,182,193,${0.14 - i * 0.02})`,
              boxShadow: `0 0 60px rgba(255,182,193,${0.2 - i * 0.025}), inset 0 0 50px rgba(255,107,107,${0.12 - i * 0.015}), 0 0 120px rgba(255,107,107,${0.1 - i * 0.012})`
            }}>
              {/* Spike Proteins */}
              {[...Array(14)].map((_, j) => {
                const angle = (j * (360 / 14)) * (Math.PI / 180);
                const distance = 48;
                const spikeLen = 14 - i * 1.3;
                const offsetX = distance * Math.cos(angle);
                const offsetY = distance * Math.sin(angle);
                return (
                  <div
                    key={`spike-${j}`}
                    style={{
                      position: "absolute",
                      width: `${spikeLen * 0.8}px`,
                      height: `${spikeLen * 3}px`,
                      left: `calc(50% - ${(spikeLen * 0.4)}px)`,
                      top: "0",
                      transform: `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%)) rotate(${angle * (180 / Math.PI)}deg)`,
                      background: `linear-gradient(to bottom, rgba(255,182,193,${0.95 - i * 0.1}), rgba(255,107,107,${0.75 - i * 0.1}), rgba(255,107,107,${0.4 - i * 0.05}))`,
                      borderRadius: "50% 50% 0 0",
                      boxShadow: `0 0 ${12 - i * 0.8}px rgba(255,182,193,${0.7 - i * 0.08})`,
                      opacity: 0.8
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Medium Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`med-${i}`}
            style={{
              position: "absolute",
              width: `${80 + i * 15}px`,
              height: `${80 + i * 15}px`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,182,193,${0.12 - i * 0.01}) 0%, rgba(255,107,107,${0.05 - i * 0.005}) 40%, transparent 70%)`,
              borderRadius: "50%",
              animation: `float ${22 + i * 1.5}s ease-in-out infinite`,
              left: `${(i * 11) % 100}%`,
              top: `${(i * 14) % 100}%`,
              boxShadow: `0 0 30px rgba(255,182,193,${0.15 - i * 0.015}), inset 0 0 20px rgba(255,107,107,${0.1 - i * 0.01})`
            }}
          />
        ))}

        {/* Small Accent Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`small-${i}`}
            style={{
              position: "absolute",
              width: `${30 + (i % 4) * 15}px`,
              height: `${30 + (i % 4) * 15}px`,
              background: `radial-gradient(circle, rgba(255,182,193,${0.2 - i * 0.01}) 0%, transparent 60%)`,
              borderRadius: "50%",
              animation: `float ${18 + (i % 5) * 2}s ease-in-out infinite`,
              left: `${(i * 8) % 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6
            }}
          />
        ))}

        {/* Neon Pink Glow Layers */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,182,193,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "pulse 4s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          animation: "pulse 5s ease-in-out infinite 1s"
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{
          background: "linear-gradient(90deg, rgba(86,28,36,0.98) 0%, rgba(109,41,50,0.98) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "2px solid rgba(255,182,193,0.3)",
          padding: "2rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 102,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #E8D8C4 0%, #FFB6C1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: 0,
              color: "#FFB6C1"
            }}>
              <GlobeIcon />
              EPIDEMIC INTELLIGENCE
            </h1>
            <p style={{ fontSize: "11px", color: "#C7B7A3", letterSpacing: "2px", fontWeight: "600", margin: "0.5rem 0 0 0" }}>
              AI-POWERED COVID-19 PREDICTION & MONITORING
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: "3rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
          {/* Country Selector */}
          <div style={{
            background: "linear-gradient(135deg, rgba(86,28,36,0.6) 0%, rgba(109,41,50,0.4) 100%)",
            border: "1.5px solid rgba(255,182,193,0.2)",
            borderRadius: "16px",
            padding: "2.5rem",
            marginBottom: "3rem",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "12px",
              fontWeight: "800",
              marginBottom: "1.5rem",
              color: "#FFB6C1",
              letterSpacing: "2px",
              textTransform: "uppercase"
            }}>
              <MapIcon />
              Select Region for Analysis
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "16px 20px",
                border: "2px solid rgba(255,182,193,0.4)",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "500",
                background: "rgba(26,14,30,0.7)",
                color: "#FFB6C1",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
              }}
            >
              {countries.map((c) => (
                <option key={c} value={c} style={{ background: "#2d1625", color: "#FFB6C1" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Dashboard Content */}
          <div style={{ display: "grid", gap: "2.5rem" }}>
            {error && (
              <div style={{
                background: "linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(200,50,50,0.15) 100%)",
                color: "#FFB6C1",
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1.5px solid rgba(255,107,107,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(255,107,107,0.1)"
              }}>
                <AlertIcon />
                <span style={{ fontSize: "15px", fontWeight: "500" }}>{error}</span>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#C7B7A3" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1.5rem", animation: "spin 2s linear infinite" }}>
                  <LoadingIcon />
                </div>
                <p style={{ fontSize: "18px", fontWeight: "500" }}>
                  Analyzing epidemic data for <span style={{ color: "#FFB6C1", fontWeight: "700" }}>{country}...</span>
                </p>
              </div>
            ) : data ? (
              <>
                {/* Risk Assessment Card */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(86,28,36,0.7) 0%, rgba(109,41,50,0.5) 100%)",
                  padding: "3rem",
                  borderRadius: "18px",
                  border: "1.5px solid rgba(255,182,193,0.2)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  animation: "slideInUp 0.6s ease"
                }}>
                  <h2 style={{
                    color: "#FFB6C1", marginTop: 0,
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    fontSize: "22px", fontWeight: "800",
                    letterSpacing: "1px", textTransform: "uppercase"
                  }}>
                    <HeartIcon />
                    Risk Assessment
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.5rem",
                    marginTop: "2rem"
                  }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${getRiskColor(data.risk_score)}30 0%, ${getRiskColor(data.risk_score)}10 100%)`,
                      color: getRiskColor(data.risk_score),
                      padding: "2rem",
                      borderRadius: "14px",
                      textAlign: "center",
                      border: `1.5px solid ${getRiskColor(data.risk_score)}50`,
                      boxShadow: `0 15px 40px ${getRiskColor(data.risk_score)}20`,
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 25px 60px ${getRiskColor(data.risk_score)}40`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 15px 40px ${getRiskColor(data.risk_score)}20`;
                      }}
                    >
                      <div style={{ fontSize: "48px", fontWeight: "900", marginBottom: "0.5rem" }}>{data.risk_score}</div>
                      <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", opacity: 0.9, textTransform: "uppercase" }}>Threat Level</div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(255,182,193,0.15) 0%, rgba(255,107,107,0.05) 100%)",
                      padding: "2rem",
                      borderRadius: "14px",
                      textAlign: "center",
                      border: "1.5px solid rgba(255,182,193,0.3)",
                      boxShadow: "0 15px 40px rgba(255,182,193,0.1)",
                      color: "#E8D8C4",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 25px 60px rgba(255,182,193,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 40px rgba(255,182,193,0.1)";
                      }}
                    >
                      <div style={{ fontSize: "36px", fontWeight: "800", color: "#FFB6C1", marginBottom: "0.5rem" }}>{(data.current_cases / 1000000).toFixed(1)}M</div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#C7B7A3", letterSpacing: "1.5px", textTransform: "uppercase" }}>Confirmed Cases</div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(144,238,144,0.15) 0%, rgba(144,238,144,0.05) 100%)",
                      padding: "2rem",
                      borderRadius: "14px",
                      textAlign: "center",
                      border: "1.5px solid rgba(144,238,144,0.3)",
                      boxShadow: "0 15px 40px rgba(144,238,144,0.1)",
                      color: "#E8D8C4",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 25px 60px rgba(144,238,144,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 40px rgba(144,238,144,0.1)";
                      }}
                    >
                      <div style={{ fontSize: "36px", fontWeight: "800", color: "#90EE90", marginBottom: "0.5rem" }}>{data.growth_rate.toFixed(2)}%</div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#C7B7A3", letterSpacing: "1.5px", textTransform: "uppercase" }}>Growth Rate</div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)",
                      padding: "2rem",
                      borderRadius: "14px",
                      textAlign: "center",
                      border: "1.5px solid rgba(255,215,0,0.3)",
                      boxShadow: "0 15px 40px rgba(255,215,0,0.1)",
                      color: "#E8D8C4",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 25px 60px rgba(255,215,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 40px rgba(255,215,0,0.1)";
                      }}
                    >
                      <div style={{ fontSize: "36px", fontWeight: "800", color: "#FFD700", marginBottom: "0.5rem" }}>{(data.predicted_cases_30d / 1000000).toFixed(1)}M</div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#C7B7A3", letterSpacing: "1.5px", textTransform: "uppercase" }}>30-Day Forecast</div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                {data.predictions && (
                  <div style={{
                    background: "linear-gradient(135deg, rgba(86,28,36,0.7) 0%, rgba(109,41,50,0.5) 100%)",
                    padding: "3rem",
                    borderRadius: "18px",
                    border: "1.5px solid rgba(255,182,193,0.2)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    animation: "slideInUp 0.6s ease 0.1s both"
                  }}>
                    <h2 style={{
                      color: "#FFB6C1", marginTop: 0,
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      fontSize: "22px", fontWeight: "800",
                      letterSpacing: "1px", textTransform: "uppercase"
                    }}>
                      <ChartIcon />
                      30-Day Forecast Projection
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={data.predictions}>
                        <defs>
                          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFB6C1" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#FFB6C1" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,183,163,0.1)" />
                        <XAxis dataKey="date" stroke="#C7B7A3" style={{ fontSize: "12px" }} />
                        <YAxis stroke="#C7B7A3" style={{ fontSize: "12px" }} />
                        <Tooltip contentStyle={{
                          background: "rgba(26,14,30,0.95)",
                          border: "1.5px solid rgba(255,182,193,0.3)",
                          borderRadius: "8px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          backdropFilter: "blur(10px)"
                        }} />
                        <Area type="monotone" dataKey="predicted_cases" stroke="#FFB6C1" fill="url(#colorPredicted)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* India Heatmap */}
                {country === "India" && heatmapData && (
                  <div style={{
                    background: "linear-gradient(135deg, rgba(86,28,36,0.7) 0%, rgba(109,41,50,0.5) 100%)",
                    padding: "3rem",
                    borderRadius: "18px",
                    border: "1.5px solid rgba(255,182,193,0.2)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    animation: "slideInUp 0.6s ease 0.2s both"
                  }}>
                    <h2 style={{
                      color: "#FFB6C1", marginTop: 0,
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      fontSize: "22px", fontWeight: "800",
                      letterSpacing: "1px", textTransform: "uppercase"
                    }}>
                      <GlobeIcon />
                      State-Wise Breakdown
                    </h2>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                      gap: "1rem",
                      marginTop: "1.5rem"
                    }}>
                      {heatmapData.data.slice(0, 12).map((state, idx) => (
                        <div key={state.region} style={{
                          background: `linear-gradient(135deg, ${getRiskColor(state.risk_level)}30 0%, ${getRiskColor(state.risk_level)}10 100%)`,
                          color: "white",
                          padding: "1.25rem",
                          borderRadius: "12px",
                          textAlign: "center",
                          border: `1.5px solid ${getRiskColor(state.risk_level)}50`,
                          boxShadow: `0 10px 30px ${getRiskColor(state.risk_level)}20`,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          animation: `slideInUp 0.6s ease ${0.3 + idx * 0.05}s both`
                        }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(-8px) scale(1.05)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${getRiskColor(state.risk_level)}40`;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 30px ${getRiskColor(state.risk_level)}20`;
                          }}
                        >
                          <div style={{ fontWeight: "800", fontSize: "13px", marginBottom: "0.5rem" }}>{state.region}</div>
                          <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "0.25rem" }}>{(state.cases / 1000000).toFixed(1)}M</div>
                          <div style={{ fontSize: "10px", fontWeight: "700", opacity: 0.9, letterSpacing: "0.5px", textTransform: "uppercase" }}>{state.risk_level} RISK</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Global Heatmap */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(86,28,36,0.7) 0%, rgba(109,41,50,0.5) 100%)",
                  padding: "3rem",
                  borderRadius: "18px",
                  border: "1.5px solid rgba(255,182,193,0.2)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  animation: "slideInUp 0.6s ease 0.3s both"
                }}>
                  <h2 style={{
                    color: "#FFB6C1", marginTop: 0,
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    fontSize: "22px", fontWeight: "800",
                    letterSpacing: "1px", textTransform: "uppercase"
                  }}>
                    <GlobeIcon />
                    Global Threat Map
                  </h2>
                  {loadingGlobal ? (
                    <div style={{ textAlign: "center", padding: "2.5rem", color: "#C7B7A3" }}>Scanning global data...</div>
                  ) : globalHeatmap ? (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))",
                      gap: "0.75rem",
                      marginTop: "1.5rem"
                    }}>
                      {globalHeatmap.countries.map((c, idx) => (
                        <div
                          key={c.country}
                          onClick={() => setCountry(c.country)}
                          style={{
                            background: `linear-gradient(135deg, ${getRiskColor(c.risk_level)}30 0%, ${getRiskColor(c.risk_level)}10 100%)`,
                            color: "white",
                            padding: "1rem",
                            borderRadius: "10px",
                            textAlign: "center",
                            cursor: "pointer",
                            border: `1.5px solid ${getRiskColor(c.risk_level)}50`,
                            boxShadow: `0 8px 25px ${getRiskColor(c.risk_level)}15`,
                            transition: "all 0.3s ease",
                            animation: `slideInUp 0.5s ease ${0.4 + idx * 0.02}s both`,
                            fontWeight: "700",
                            fontSize: "11px"
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 15px 40px ${getRiskColor(c.risk_level)}35`;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 25px ${getRiskColor(c.risk_level)}15`;
                          }}
                          title={c.country}>
                          <div>{c.country}</div>
                          <div style={{ fontSize: "9px", opacity: 0.7, marginTop: "0.25rem" }}>{c.risk_level}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#C7B7A3" }}>Failed to load global data</div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#C7B7A3" }}>No data available</div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          background: "linear-gradient(90deg, rgba(86,28,36,0.98) 0%, rgba(109,41,50,0.98) 100%)",
          borderTop: "1.5px solid rgba(255,182,193,0.3)",
          padding: "2rem",
          textAlign: "center",
          color: "#C7B7A3",
          marginTop: "3rem",
          fontSize: "12px",
          backdropFilter: "blur(10px)"
        }}>
          <p style={{ fontWeight: "600", letterSpacing: "1px", marginBottom: "0.5rem" }}>
            © 2026 EPIDEMIC INTELLIGENCE • AI-POWERED PREDICTION
          </p>
          <p style={{ opacity: 0.6, fontSize: "11px", letterSpacing: "0.5px", margin: 0 }}>
            Last updated: {new Date().toLocaleString()}
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 182, 193, 0.4) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 10px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(255, 182, 193, 0.3);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 182, 193, 0.6);
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}

export default App;
