import { useState, useEffect } from "react";
import { getAccessToken } from "../auth";

export type Forecast = {
  id: number;
  sku: string;
  forecastDate: string;
  baseValue: number;
  upperBound: number;
  lowerBound: number;
  confidenceLevel: number;
  seasonalFactor: number;
  trendComponent: number;
  modelVersion: string;
  dataQualityScore: number;
};

export function useForecasts() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forecast`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTimeout(() => {
        setForecasts(data.forecasts);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load forecasts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  return { forecasts, loading, error, refetch: fetchForecasts };
}
