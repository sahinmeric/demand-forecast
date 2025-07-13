import { useEffect, useState } from 'react';
import { getAccessToken } from '../auth';

type Props = {
  preview: Record<string, any>[];
  mapping: Record<string, string>;
  fileName: string;
};

type RowResult = {
  row: Record<string, any>;
  errors: string[];
};

export default function DataValidation({ preview, mapping, fileName }: Props) {
  const [validatedRows, setValidatedRows] = useState<RowResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const results = preview.map((rawRow) => {
      const row: Record<string, any> = {};
      const errors: string[] = [];

      // Apply mapping
      for (const [originalKey, mappedKey] of Object.entries(mapping)) {
        row[mappedKey] = rawRow[originalKey];
      }

      // Validate fields
      if (!/^[a-zA-Z0-9]{3,20}$/.test(row.sku)) {
        errors.push('Invalid SKU');
      }

      const fechaStr = row.fecha;
      const parsedDate = parseDate(fechaStr);
      if (!parsedDate) {
        errors.push('Invalid Fecha');
      } else {
        row.fecha = parsedDate.toISOString();
      }

      const cantidad = parseInt(row.cantidad_vendida, 10);
      if (isNaN(cantidad) || cantidad < 1 || cantidad > 100000) {
        errors.push('Invalid Cantidad Vendida');
      }

      const precio = parseFloat(row.precio);
      if (
        isNaN(precio) ||
        precio <= 0 ||
        !/^\d+(\.\d{1,4})?$/.test(String(row.precio))
      ) {
        errors.push('Invalid Precio');
      }

      const promo = String(row.promocion_activa).toLowerCase();
      const truthy = ['1', 'true', 'sí', 'si'];
      const falsy = ['0', 'false', 'no'];
      if (truthy.includes(promo)) row.promocion_activa = true;
      else if (falsy.includes(promo)) row.promocion_activa = false;
      else errors.push('Invalid Promoción');

      return { row, errors };
    });

    setValidatedRows(results);
  }, [preview, mapping]);

  const validRows = validatedRows.filter((r) => r.errors.length === 0);
  const invalidRows = validatedRows.filter((r) => r.errors.length > 0);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const token = getAccessToken();
      const res = await fetch('http://localhost:3000/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName,
          rows: validRows.map((r) => r.row),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSaveMessage(`✅ ${data.message}`);
    } catch (err: any) {
      setSaveMessage(`❌ Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3>Step 3: Validation Results</h3>
      <p>
        ✅ Valid rows: {validRows.length} | ❌ Invalid rows: {invalidRows.length}
      </p>

      {invalidRows.length > 0 && (
        <>
          <h4>❌ Invalid Rows</h4>
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                {Object.keys(invalidRows[0].row).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {invalidRows.map((r, i) => (
                <tr key={i}>
                  {Object.values(r.row).map((val, j) => (
                    <td key={j}>{String(val)}</td>
                  ))}
                  <td>{r.errors.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {validRows.length > 0 && (
        <>
          <h4>✅ Valid Rows</h4>
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                {Object.keys(validRows[0].row).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validRows.map((r, i) => (
                <tr key={i}>
                  {Object.values(r.row).map((val, j) => (
                    <td key={j}>{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Valid Rows to Database'}
            </button>
            {saveMessage && <p>{saveMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
}

function parseDate(dateStr: string): Date | null {
  // Try ISO
  const iso = new Date(dateStr);
  if (!isNaN(iso.getTime())) return iso;

  // Try DD/MM/YYYY
  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const mmddyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;

  let match = ddmmyyyy.exec(dateStr);
  if (match) {
    const [_, d, m, y] = match;
    return new Date(`${y}-${m}-${d}`);
  }

  match = mmddyyyy.exec(dateStr);
  if (match) {
    const [_, m, d, y] = match;
    return new Date(`${y}-${m}-${d}`);
  }

  return null;
}
