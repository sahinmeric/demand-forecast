import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import type { UploadPreview } from "../types";
import { useFileUpload } from "../hooks/useFileUpload";

type Props = {
  onUploadComplete: (data: UploadPreview) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  const { getRootProps, getInputProps, isDragActive, loading, error } =
    useFileUpload(onUploadComplete);

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

      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", mb: 2 }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
