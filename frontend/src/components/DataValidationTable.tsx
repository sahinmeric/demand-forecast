import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { validators } from "../utils/validationRules";
import type { PreviewRow } from "../types";
import Loader from "./Loader";

type Props = {
  data: PreviewRow[];
  mapping: Record<string, string>;
  fileName: string;
  onSave: (cleanData: PreviewRow[], fileName: string) => void;
  saving: boolean;
  message: string;
};

export default function DataValidationTable({
  data,
  mapping,
  fileName,
  onSave,
  saving,
  message,
}: Props) {
  const [rows, setRows] = useState<PreviewRow[]>(data);
  const [errors, setErrors] = useState<boolean[][]>([]);

  useEffect(() => {
    const validationResults = rows.map((row) =>
      Object.keys(mapping).map((originalCol) => {
        const expectedField = mapping[originalCol];
        const value = row[originalCol];
        const validator = validators[expectedField];
        return validator ? !validator(value) : false;
      })
    );
    setErrors(validationResults);
  }, [rows, mapping]);

  const handleChange = (rowIndex: number, colKey: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [colKey]: value,
    };
    setRows(updatedRows);
  };

  const isValid = errors.every((row) => row.every((cell) => !cell));

  if (saving) {
    return <Loader message="Saving data..." fullHeight />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Validate & Clean Data
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            {Object.keys(mapping).map((col) => (
              <TableCell key={col}>
                {col} → {mapping[col]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(mapping).map((colKey, colIndex) => {
                const value = row[colKey];
                const isCellInvalid = errors[rowIndex]?.[colIndex] ?? false;

                return (
                  <TableCell key={colKey}>
                    <TextField
                      value={value}
                      onChange={(e) =>
                        handleChange(rowIndex, colKey, e.target.value)
                      }
                      error={isCellInvalid}
                      helperText={isCellInvalid ? "Invalid" : ""}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="contained"
        color="primary"
        disabled={!isValid || saving}
        sx={{ mt: 2 }}
        onClick={() => onSave(rows, fileName)}
      >
        Save to database
      </Button>

      {message && (
        <Alert
          severity={message.startsWith("✅") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
}
