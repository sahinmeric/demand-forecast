import { Button, Alert } from "@mui/material";
import { useForecasts } from "../hooks/useForecasts";
import ForecastTable from "../components/ForecastTable";
import { useGenerateForecast } from "../hooks/useGenerateForecast";
import Loader from "../components/Loader";
import PageLayout from "../components/PageLayout";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ForecastPage() {
  const {
    forecasts,
    loading: loadingForecasts,
    error,
    refetch,
  } = useForecasts();
  const {
    confirm,
    isOpen,
    title,
    message: confirmMessage,
    handleCancel,
    handleConfirm,
  } = useConfirmDialog();

  const { generate, loading: generating, message } = useGenerateForecast();

  const handleGenerate = () => {
    confirm({
      title: "Confirm Forecast Generation",
      message: "Are you sure you want to generate forecasts for all products?",
      onConfirm: async () => {
        const result = await generate();
        if (result.success) {
          await refetch();
        }
      },
    });
  };

  if (loadingForecasts) {
    return <Loader message="Loading forecasts..." fullHeight />;
  }

  if (generating) {
    return <Loader message="Generating forecasts..." fullHeight />;
  }

  return (
    <PageLayout title="Forecast Results">
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
      <ConfirmDialog
        open={isOpen}
        title={title}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
}
