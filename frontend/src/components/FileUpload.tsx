import { Box, Typography, Paper, Alert } from "@mui/material";
import type { UploadPreview } from "../types";
import { useFileUpload } from "../hooks/useFileUpload";
import Loader from "./Loader";
type Props = {
  onUploadComplete: (data: UploadPreview) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  const { getRootProps, getInputProps, isDragActive, loading, error } =
    useFileUpload(onUploadComplete);

  if (loading) {
    return <Loader message="Uploading file..." />;
  }

  return (
    <Box>
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          border: "2px dashed #aaa",
          padding: 3,
          textAlign: "center",
          mb: 3,
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? "Drop the file here..."
            : "Drag & drop a CSV/XLSX file here, or click to select"}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
