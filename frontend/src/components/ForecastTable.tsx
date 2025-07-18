import type { Forecast } from "../hooks/useForecasts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type Props = {
  forecasts: Forecast[];
};

export default function ForecastTable({ forecasts }: Props) {
  if (forecasts.length === 0) {
    return <Typography>No forecast data available.</Typography>;
  }

  return (
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
        {forecasts.map((f) => (
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
  );
}
