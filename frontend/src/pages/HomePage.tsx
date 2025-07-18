import { Container, Typography, Button, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Demand Forecast App
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Predict, Analyze, and Plan with Confidence.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;
