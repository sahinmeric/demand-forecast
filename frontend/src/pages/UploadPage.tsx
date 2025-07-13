import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FieldMapping from '../components/FieldMapping';
import DataValidation from '../components/DataValidation';


export default function UploadPage() {
  const [preview, setPreview] = useState<any | null>(null);
  const [mapping, setMapping] = useState<any | null>(null);

  return (
    <div>
      <h2>Upload Data Wizard</h2>

      {!preview && <FileUpload onUploadComplete={setPreview} />}

      {preview && !mapping && (
        <FieldMapping preview={preview.preview} onMappingComplete={setMapping} />
      )}

      {mapping && (
        <DataValidation preview={preview.preview} mapping={mapping} />
      )}
    </div>
  );
}
