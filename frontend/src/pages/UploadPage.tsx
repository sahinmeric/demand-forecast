import { useState } from "react";
import FileUpload from "../components/FileUpload";
import FieldMapping from "../components/FieldMapping";
import DataValidationTable from "../components/DataValidationTable";
import type { UploadPreview } from "../types";
import { useSaveCleanData } from "../hooks/useSaveCleanData";
import PageLayout from "../components/PageLayout";
import { Alert, Box, Typography, Button } from "@mui/material";

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
          data={preview.fullData}
          mapping={mapping}
          fileName={preview.name}
          onSave={handleSave}
          saving={saving}
          message={saveMessage}
        />
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {saved && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          mt={4}
          textAlign="center"
        >
          <Typography variant="h5" gutterBottom>
            🎉 Data is validated and saved successfully!
          </Typography>
          <Typography variant="body1" gutterBottom>
            {saveMessage ||
              "Your data has been successfully saved to the database."}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can now proceed to view or analyze your sales data.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/sales"
            sx={{ mt: 2 }}
          >
            Go to Sales Data
          </Button>
        </Box>
      )}
    </PageLayout>
  );
}
