import { useState } from "react";
import FileUpload from "../components/FileUpload";
import FieldMapping from "../components/FieldMapping";
import DataValidationTable from "../components/DataValidationTable";
import type { UploadPreview } from "../types";
import { useSaveCleanData } from "../hooks/useSaveCleanData";
import PageLayout from "../components/PageLayout";
import { Alert } from "@mui/material";

export default function UploadPage() {
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [mapping, setMapping] = useState<Record<string, string> | null>(null);
  const [saved, setSaved] = useState(false);

  const { saveToDatabase, saving, saveMessage, error } = useSaveCleanData();

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
    <PageLayout title="Upload Data Wizard">
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
          message={saveMessage}
        />
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {saved && <p>🎉 Data is validated and saved successfully!</p>}
    </PageLayout>
  );
}
