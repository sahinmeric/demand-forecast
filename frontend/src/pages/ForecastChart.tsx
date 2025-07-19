import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Button,
  MenuItem,
  Select,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { useGenerateForecastForSku } from "../hooks/useGenerateForecastForSku";
import { useSalesData } from "../hooks/useSalesData";
import { getUniqueSkus } from "../utils/getUniqueSkus";
import Loader from "../components/Loader";
import type { SalesRecord, ForecastRecord } from "../types";

type CombinedRow = {
  date: string;
  actual?: number;
  forecast?: number;
  upper?: number;
  lower?: number;
};

export default function ForecastChartPage() {
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
      setSku(uniqueSkus[0]); // default to first available SKU
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

  if (salesLoading) return <Loader message="Loading SKUs..." fullHeight />;

  return (
    <Box sx={{ px: 4 }}>
      <Typography variant="h5" gutterBottom>
        Forecast Chart
      </Typography>

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

          <AreaChart
            width={900}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ccc" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ccc" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#82ca9d"
              name="Forecast"
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#conf)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="url(#conf)"
              dot={false}
            />
          </AreaChart>
        </>
      )}
    </Box>
  );
}
