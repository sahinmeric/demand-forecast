import { Button, Typography, Alert } from "@mui/material";
import { useForecasts } from "../hooks/useForecasts";
import ForecastTable from "../components/ForecastTable";
import { useGenerateForecast } from "../hooks/useGenerateForecast";
import Loader from "../components/Loader";
export default function ForecastPage() {
  const {
    forecasts,
    loading: loadingForecasts,
    error,
    refetch,
  } = useForecasts();
  const { generate, loading: generating, message } = useGenerateForecast();

  const handleGenerate = async () => {
    const result = await generate();
    if (result.success) {
      await refetch();
    }
  };

  if (loadingForecasts) {
    return <Loader message="Loading forecasts..." />;
  }

  if (generating) {
    return <Loader message="Generating forecasts..." />;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Forecast Results
      </Typography>

      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loadingForecasts || generating}
        sx={{ mb: 2 }}
      >
        Generate Forecasts
      </Button>

      {message && (
        <Alert severity={message.startsWith("✅") ? "success" : "error"}>
          {message}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <ForecastTable forecasts={forecasts} />
    </>
  );
}
