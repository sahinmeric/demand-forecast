import { useEffect, useState } from 'react';
import { getAccessToken } from '../auth';

type SalesRow = {
  id: number;
  sku: string;
  date: string;
  quantity: number;
  price: number;
  promotion: boolean;
  category: string;
  fileName: string;
  uploadedAt: string;
};

export default function SalesTablePage() {
  const [rows, setRows] = useState<SalesRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch('http://localhost:3000/api/files/sales-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRows(data.records);
      } catch (err: any) {
        setError(err.message || 'Failed to load sales data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Sales Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rows.length > 0 ? (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Promotion</th>
              <th>Category</th>
              <th>File</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.sku}</td>
                <td>{r.date.slice(0, 10)}</td>
                <td>{r.quantity}</td>
                <td>{r.price}</td>
                <td>{r.promotion ? 'Yes' : 'No'}</td>
                <td>{r.category}</td>
                <td>{r.fileName}</td>
                <td>{new Date(r.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sales data found.</p>
      )}
    </div>
  );
}
