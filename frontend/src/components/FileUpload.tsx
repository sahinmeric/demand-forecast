import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import type { UploadPreview } from "../types";
import { useFileUpload } from "../hooks/useFileUpload";

type Props = {
  onUploadComplete: (data: UploadPreview) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  const { getRootProps, getInputProps, isDragActive, preview, loading, error } =
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

      {preview && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Preview: {preview.name}
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(preview.preview[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.preview.slice(0, 5).map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((val, i) => (
                    <TableCell key={i}>{String(val)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="caption" color="text.secondary">
            Showing first 5 rows for preview
          </Typography>
        </Box>
      )}
    </Box>
  );
}
