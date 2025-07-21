import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  TablePagination,
} from "@mui/material";
import { useSalesData } from "../hooks/useSalesData";
import { filterSalesRows } from "../utils/filterSalesData";
import PageLayout from "../components/PageLayout";

export default function SalesTablePage() {
  const [skuFilter, setSkuFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { rows, error, loading } = useSalesData();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filtered = filterSalesRows(rows, {
    sku: skuFilter,
    fromDate,
    toDate,
  });
  const paginatedRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <PageLayout
      title="Sales Data"
      loading={loading}
      loadingMessage="Loading sales data..."
    >
      {error && <Alert severity="error">{error}</Alert>}

      <Box display="flex" gap={2} my={2}>
        <TextField
          label="Filter by SKU"
          value={skuFilter}
          onChange={(e) => setSkuFilter(e.target.value)}
          size="small"
        />
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          size="small"
        />
        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          size="small"
        />
      </Box>

      {filtered.length > 0 ? (
        <Paper elevation={1} sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Promotion</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Uploaded At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.sku}</TableCell>
                  <TableCell>{r.date.slice(0, 10)}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>{r.price.toFixed(2)}</TableCell>
                  <TableCell>{r.promotion ? "Yes" : "No"}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.fileName}</TableCell>
                  <TableCell>
                    {new Date(r.uploadedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>
      ) : (
        <Typography variant="body1" mt={2}>
          No matching rows.
        </Typography>
      )}
    </PageLayout>
  );
}
