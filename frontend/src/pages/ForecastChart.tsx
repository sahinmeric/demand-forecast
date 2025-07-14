import { useEffect, useState } from 'react';
import { getAccessToken } from '../auth';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart,
} from 'recharts';

type CombinedRow = {
  date: string;
  actual?: number;
  forecast?: number;
  upper?: number;
  lower?: number;
};

export default function ForecastChartPage() {
  const [sku, setSku] = useState('PROD001');
  const [data, setData] = useState<CombinedRow[]>([]);
  const [error, setError] = useState('');

  const fetchCombined = async () => {
    try {
      const token = getAccessToken();
      const [salesRes, forecastRes] = await Promise.all([
        fetch(`http://localhost:3000/api/files/sales-data/${sku}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3000/api/forecast/${sku}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const salesJson = await salesRes.json();
      const forecastJson = await forecastRes.json();

      const sales = salesJson.records.map((r: any) => ({
        date: r.date.slice(0, 10),
        actual: r.quantity,
      }));

      const forecasts = forecastJson.forecasts.map((f: any) => ({
        date: f.forecastDate.slice(0, 10),
        forecast: f.baseValue,
        upper: f.upperBound,
        lower: f.lowerBound,
      }));

      const all = [...sales, ...forecasts];
      const merged: Record<string, CombinedRow> = {};

      all.forEach((entry) => {
        const d = entry.date;
        merged[d] = { ...merged[d], ...entry, date: d };
      });

      const mergedArr = Object.values(merged).sort((a, b) => a.date.localeCompare(b.date));
      setData(mergedArr);
    } catch (err: any) {
      setError(err.message || 'Failed to load chart data');
    }
  };

  useEffect(() => {
    fetchCombined();
  }, [sku]);

  return (
    <div>
      <h2>Forecast Chart</h2>

      <label>Select SKU: </label>
      <select value={sku} onChange={(e) => setSku(e.target.value)}>
        <option>PROD001</option>
        <option>PROD002</option>
        <option>PROD003</option>
        <option>PROD004</option>
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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

        <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
        <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast" />
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="url(#conf)"
          name="Upper Bound"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="url(#conf)"
          name="Lower Bound"
          dot={false}
        />
      </AreaChart>
    </div>
  );
}
