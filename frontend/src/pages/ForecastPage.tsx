import { useEffect, useState } from 'react';
import { getAccessToken } from '../auth';

type Forecast = {
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

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationMessage, setGenerationMessage] = useState('');

  const fetchForecasts = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await fetch('http://localhost:3000/api/forecast', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForecasts(data.forecasts);
    } catch (err: any) {
      setError(err.message || 'Failed to load forecast data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  const generateForecasts = async () => {
    setGenerationMessage('');
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch('http://localhost:3000/api/forecast/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGenerationMessage(`✅ ${data.message}`);
      await fetchForecasts(); // reload table after generation
    } catch (err: any) {
      setGenerationMessage(`❌ Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forecast Results</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={generateForecasts} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Forecasts'}
      </button>

      {generationMessage && <p>{generationMessage}</p>}

      {forecasts.length > 0 ? (
        <table border={1} cellPadding={6} style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Forecast Date</th>
              <th>Base</th>
              <th>Lower</th>
              <th>Upper</th>
              <th>Confidence</th>
              <th>Trend</th>
              <th>Seasonality</th>
              <th>Model</th>
              <th>Quality</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.id}>
                <td>{f.sku}</td>
                <td>{f.forecastDate.slice(0, 10)}</td>
                <td>{f.baseValue}</td>
                <td>{f.lowerBound}</td>
                <td>{f.upperBound}</td>
                <td>{(f.confidenceLevel * 100).toFixed(0)}%</td>
                <td>{f.trendComponent}</td>
                <td>{f.seasonalFactor}</td>
                <td>{f.modelVersion}</td>
                <td>{(f.dataQualityScore * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No forecast data available yet.</p>
      )}
    </div>
  );
}
