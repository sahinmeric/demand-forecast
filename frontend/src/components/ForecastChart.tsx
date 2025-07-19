import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
} from "recharts";
import type { CombinedRow } from "../types";
import { Box, Typography } from "@mui/material";

type Props = {
  data: CombinedRow[];
};

export default function ForecastChart({ data }: Props) {
  if (data.length === 0) {
    return <Typography>No data available.</Typography>;
  }

  return (
    <Box>
      <AreaChart
        width={900}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ccc" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ccc" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#82ca9d"
          name="Forecast"
        />
        <Area
          type="monotone"
          dataKey="upper"
          stroke="none"
          fill="url(#conf)"
          name="Upper Bound"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="lower"
          stroke="none"
          fill="url(#conf)"
          name="Lower Bound"
          dot={false}
        />
      </AreaChart>
    </Box>
  );
}
