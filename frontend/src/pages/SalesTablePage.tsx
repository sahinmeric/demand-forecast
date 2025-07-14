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
  const [skuFilter, setSkuFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch('http://localhost:3000/api/files/sales-data', {
          headers: { Authorization: `Bearer ${token}` },
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

  // 🧠 Apply filters
  const filtered = rows.filter((r) => {
    const matchesSKU = skuFilter === '' || r.sku.toLowerCase().includes(skuFilter.toLowerCase());
    const rowDate = new Date(r.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesFrom = !from || rowDate >= from;
    const matchesTo = !to || rowDate <= to;
    return matchesSKU && matchesFrom && matchesTo;
  });

  return (
    <div>
      <h2>Sales Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 🔧 Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filter by SKU"
          value={skuFilter}
          onChange={(e) => setSkuFilter(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
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
            {filtered.map((r) => (
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
        <p>No matching rows.</p>
      )}
    </div>
  );
}
