import { useState, useEffect } from "react";
import { getAvailableCountries } from "../api";
import "../styles/Shared.css";

interface CountrySelectorProps {
  onCountryChange: (country: string) => void;
  currentCountry: string;
}

export function CountrySelector({
  onCountryChange,
  currentCountry,
}: CountrySelectorProps) {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAvailableCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="selector-container">
      <label htmlFor="country-select" className="selector-label">
        Select Country/Region
      </label>
      <select
        id="country-select"
        value={currentCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="selector-input"
        disabled={loading}
      >
        <option value="">-- Choose a country --</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}
