import { useState } from "react";
import type { Forecast } from "../hooks/useForecasts";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";

type Props = {
  forecasts: Forecast[];
};

export default function ForecastTable({ forecasts }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [skuFilter, setSkuFilter] = useState("");
  const [minQuality, setMinQuality] = useState("");
  const [maxQuality, setMaxQuality] = useState("");

  const filtered = forecasts.filter((f) => {
    const matchesSKU = f.sku.toLowerCase().includes(skuFilter.toLowerCase());

    const minQ = minQuality ? parseFloat(minQuality) / 100 : null;
    const maxQ = maxQuality ? parseFloat(maxQuality) / 100 : null;

    const matchesMinQ = minQ === null || f.dataQualityScore >= minQ;
    const matchesMaxQ = maxQ === null || f.dataQualityScore <= maxQ;

    return matchesSKU && matchesMinQ && matchesMaxQ;
  });

  const paginatedForecasts = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (forecasts.length === 0) {
    return <Typography>No forecast data available.</Typography>;
  }

  return (
    <>
      <Box display="flex" gap={2} my={2} flexWrap="wrap">
        <TextField
          label="Filter by SKU"
          value={skuFilter}
          onChange={(e) => {
            setSkuFilter(e.target.value);
            setPage(0);
          }}
          size="small"
        />
        <TextField
          label="Min Quality (%)"
          type="number"
          inputProps={{ min: 0, max: 100 }}
          value={minQuality}
          onChange={(e) => {
            setMinQuality(e.target.value);
            setPage(0);
          }}
          size="small"
        />
        <TextField
          label="Max Quality (%)"
          type="number"
          inputProps={{ min: 0, max: 100 }}
          value={maxQuality}
          onChange={(e) => {
            setMaxQuality(e.target.value);
            setPage(0);
          }}
          size="small"
        />
      </Box>

      <Table size="small" sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Forecast Date</TableCell>
            <TableCell>Base</TableCell>
            <TableCell>Lower</TableCell>
            <TableCell>Upper</TableCell>
            <TableCell>Confidence</TableCell>
            <TableCell>Trend</TableCell>
            <TableCell>Seasonality</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Quality</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedForecasts.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.sku}</TableCell>
              <TableCell>{f.forecastDate.slice(0, 10)}</TableCell>
              <TableCell>{f.baseValue}</TableCell>
              <TableCell>{f.lowerBound}</TableCell>
              <TableCell>{f.upperBound}</TableCell>
              <TableCell>{(f.confidenceLevel * 100).toFixed(0)}%</TableCell>
              <TableCell>{f.trendComponent}</TableCell>
              <TableCell>{f.seasonalFactor}</TableCell>
              <TableCell>{f.modelVersion}</TableCell>
              <TableCell>{(f.dataQualityScore * 100).toFixed(0)}%</TableCell>
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
    </>
  );
}
