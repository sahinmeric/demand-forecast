import { useState, useEffect } from "react";
import { Button, MenuItem, Select, Alert, Box } from "@mui/material";
import { useGenerateForecastForSku } from "../hooks/useGenerateForecastForSku";
import { useSalesData } from "../hooks/useSalesData";
import { getUniqueSkus } from "../utils/getUniqueSkus";
import type { SalesRecord, ForecastRecord } from "../types";
import type { CombinedRow } from "../types";
import ForecastChart from "../components/ForecastChart";
import PageLayout from "../components/PageLayout";

export default function ChartPage() {
  const { rows: salesRows, loading: salesLoading } = useSalesData();
  const [sku, setSku] = useState<string | null>(null);
  const [data, setData] = useState<CombinedRow[]>([]);
  const [error, setError] = useState("");
  const {
    generate,
    loading: generating,
    message,
  } = useGenerateForecastForSku();

  const uniqueSkus = getUniqueSkus(salesRows);

  useEffect(() => {
    if (!sku && uniqueSkus.length > 0) {
      setSku(uniqueSkus[0]);
    }
  }, [uniqueSkus]);

  const fetchCombined = async () => {
    if (!sku) return;
    try {
      const token = localStorage.getItem("accessToken");
      const [salesRes, forecastRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/files/sales-data/${sku}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/forecast/${sku}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const salesJson = await salesRes.json();
      const forecastJson = await forecastRes.json();

      const sales = salesJson.records.map((r: SalesRecord) => ({
        date: r.date.slice(0, 10),
        actual: r.quantity,
      }));

      const forecasts = forecastJson.forecasts.map((f: ForecastRecord) => ({
        date: f.forecastDate.slice(0, 10),
        forecast: f.baseValue,
        upper: f.upperBound,
        lower: f.lowerBound,
      }));

      const all = [...sales, ...forecasts];
      const merged: Record<string, CombinedRow> = {};

      all.forEach((entry) => {
        merged[entry.date] = { ...merged[entry.date], ...entry };
      });

      const mergedArr = Object.values(merged).sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      setData(mergedArr);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load chart data"
      );
    }
  };

  useEffect(() => {
    fetchCombined();
  }, [sku]);

  const handleGenerateForecast = async () => {
    if (!sku) return;
    const result = await generate(sku);
    if (result.success) await fetchCombined();
  };

  return (
    <PageLayout
      title="Sales Forecast"
      loading={salesLoading}
      loadingMessage="Loading forecast data..."
    >
      {uniqueSkus.length === 0 ? (
        <Alert severity="info">
          No sales data found. Please upload data first.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Select
              value={sku || ""}
              onChange={(e) => setSku(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              {uniqueSkus.map((skuOption) => (
                <MenuItem key={skuOption} value={skuOption}>
                  {skuOption}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              onClick={handleGenerateForecast}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Forecast"}
            </Button>
          </Box>

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <ForecastChart data={data} />
        </>
      )}
    </PageLayout>
  );
}
