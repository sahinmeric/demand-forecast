import { useState, useEffect } from 'react';

type Props = {
  preview: Record<string, any>[];
  onMappingComplete: (mapping: Record<string, string>) => void;
};

const REQUIRED_FIELDS = [
  'sku',
  'fecha',
  'cantidad_vendida',
  'precio',
  'promocion_activa',
  'categoria',
];

export default function FieldMapping({ preview, onMappingComplete }: Props) {
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (preview.length > 0) {
      setColumns(Object.keys(preview[0]));
    }
  }, [preview]);

  const handleChange = (original: string, mappedTo: string) => {
    setMapping((prev) => ({
      ...prev,
      [original]: mappedTo,
    }));
  };

  const handleSubmit = () => {
    const usedFields = Object.values(mapping);
    const missing = REQUIRED_FIELDS.filter((field) => !usedFields.includes(field));

    if (missing.length > 0) {
      setError(`Missing required mappings: ${missing.join(', ')}`);
      return;
    }

    const duplicates = usedFields.filter((v, i, a) => a.indexOf(v) !== i);
    if (duplicates.length > 0) {
      setError(`Duplicate mappings not allowed: ${duplicates.join(', ')}`);
      return;
    }

    setError('');
    onMappingComplete(mapping);
  };

  return (
    <div>
      <h3>Step 2: Map Your Columns</h3>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                <div>{col}</div>
                <select
                  value={mapping[col] || ''}
                  onChange={(e) => handleChange(col, e.target.value)}
                >
                  <option value="">-- map to --</option>
                  {REQUIRED_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{String(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit}>Confirm Mapping</button>
    </div>
  );
}
