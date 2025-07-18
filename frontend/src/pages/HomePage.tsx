import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSnackbar from "../hooks/useSnackbar";


const HomePage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
  open: snackbarOpen,
  message: snackbarMessage,
  severity: snackbarSeverity,
  showSnackbar,
  handleClose: handleSnackbarClose,
} = useSnackbar();

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      showSnackbar("Logged in successfully!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      showSnackbar("Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Demand Forecast App
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Button
                onClick={handleRegister}
                size="small"
                color="secondary"
                sx={{ textTransform: "none", p: 0, minWidth: "auto" }}
              >
                Register here
              </Button>
            </Typography>
          </Grid>
        </Box>
      </Paper>

      <Snackbar 
      open={snackbarOpen} 
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
