import { Paper, Typography, Box, CircularProgress, Alert } from "@mui/material";
import useCurrentUser from "../hooks/useCurrentUser";
import PageLayout from "../components/PageLayout";

export default function DashboardPage() {
  const { user, loading, error } = useCurrentUser();

  return (
    <PageLayout title="Dashboard">
      <Paper elevation={4} sx={{ p: 4, textAlign: "center" }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : user ? (
          <Box mt={2}>
            <Typography variant="body1">
              Welcome, <strong>{user.email}</strong>
            </Typography>
            <Typography variant="body2">User ID: {user.id}</Typography>
            <Typography variant="body2">Role: {user.role}</Typography>
          </Box>
        ) : null}
      </Paper>
    </PageLayout>
  );
}
