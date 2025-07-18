import { useState } from "react";
import FileUpload from "../components/FileUpload";
import FieldMapping from "../components/FieldMapping";
import DataValidationTable from "../components/DataValidationTable";
import type { UploadPreview } from "../types";
import { useSaveCleanData } from "../hooks/useSaveCleanData";
import { Container } from "@mui/material";

export default function UploadPage() {
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [mapping, setMapping] = useState<Record<string, string> | null>(null);
  const [saved, setSaved] = useState(false);

  const { saveToDatabase, saving, message } = useSaveCleanData();

  const handleSave = async (
    validRows: Record<string, unknown>[],
    fileName: string
  ) => {
    const result = await saveToDatabase(validRows, fileName);
    if (result.success) {
      setSaved(true);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <h2>Upload Data Wizard</h2>

      {!preview && <FileUpload onUploadComplete={setPreview} />}

      {preview && !mapping && (
        <FieldMapping
          preview={preview.preview}
          onMappingComplete={setMapping}
        />
      )}

      {preview && mapping && !saved && (
        <DataValidationTable
          data={preview.preview}
          mapping={mapping}
          fileName={preview.name}
          onSave={handleSave}
          saving={saving}
          message={message}
        />
      )}

      {saved && <p>🎉 Data is validated and saved successfully!</p>}
    </Container>
  );
}
