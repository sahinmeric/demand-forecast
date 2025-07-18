import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import useCurrentUser from "../hooks/useCurrentUser";

export default function DashboardPage() {
  const { user, loading, error } = useCurrentUser();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography>

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
    </Container>
  );
}
