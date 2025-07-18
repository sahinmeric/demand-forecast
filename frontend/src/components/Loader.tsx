import { Box, CircularProgress, Typography } from "@mui/material";

type LoaderProps = {
  message?: string;
  size?: number;
  center?: boolean;
  marginBottom?: number;
};

const Loader = ({
  message = "Loading...",
  size = 40,
  center = true,
  marginBottom = 2,
}: LoaderProps) => {
  return (
    <Box
      sx={{
        textAlign: center ? "center" : "left",
        mb: marginBottom,
        display: "flex",
        flexDirection: "column",
        alignItems: center ? "center" : "flex-start",
      }}
    >
      <CircularProgress sx={{ mb: 1 }} size={size} />
      <Typography variant="body2" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
