import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type UploadPreview = {
  name: string;
  preview: Record<string, any>[];
};

type Props = {
  onUploadComplete: (data: any) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:3000/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onUploadComplete(data);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #aaa',
          padding: 20,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag & drop a CSV or XLSX file here, or click to select</p>
        )}
      </div>

      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {preview && (
        <div>
          <h3>Preview of: {preview.name}</h3>
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                {Object.keys(preview.preview[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.preview.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
