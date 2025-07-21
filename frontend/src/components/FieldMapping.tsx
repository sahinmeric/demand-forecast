import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { PreviewRow } from "../types";
import Loader from "./Loader";
import { FIELD_LABELS, REQUIRED_FIELDS } from "../constant/constant";

type Props = {
  preview: PreviewRow[];
  onMappingComplete: (mapping: Record<string, string>) => void;
};

export default function FieldMapping({ preview, onMappingComplete }: Props) {
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preview.length > 0) {
      setColumns(Object.keys(preview[0]));
    }
  }, [preview]);

  const handleChange = (column: string, value: string) => {
    setMapping((prev) => ({ ...prev, [column]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    const usedFields = Object.values(mapping);
    const missing = REQUIRED_FIELDS.filter(
      (field) => !usedFields.includes(field)
    );

    if (missing.length > 0) {
      setError(
        `Missing required mappings: ${missing
          .map((f) => FIELD_LABELS[f])
          .join(", ")}`
      );
      setLoading(false);
      return;
    }

    const duplicates = usedFields.filter((v, i, a) => a.indexOf(v) !== i);
    if (duplicates.length > 0) {
      setError(`Duplicate mappings not allowed: ${duplicates.join(", ")}`);
      setLoading(false);
      return;
    }

    setError("");

    setTimeout(() => {
      onMappingComplete(mapping);
      setLoading(false);
    }, 2000);
  };

  if (loading) {
    return <Loader message="Mapping columns..." fullHeight />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Map Your Columns
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Columns not mapped will be <strong>discarded</strong>. Make sure all
        required fields are mapped correctly.
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel>Map to</InputLabel>
                  <Select
                    value={mapping[col] || ""}
                    label="Map to"
                    onChange={(e) => handleChange(col, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>-- map to --</em>
                    </MenuItem>
                    {REQUIRED_FIELDS.map((field) => (
                      <MenuItem key={field} value={field}>
                        {FIELD_LABELS[field]}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography fontWeight="bold">{col}</Typography>
                </FormControl>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {preview.slice(0, 5).map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        color="primary"
      >
        Confirm Mapping
      </Button>
    </Box>
  );
}
