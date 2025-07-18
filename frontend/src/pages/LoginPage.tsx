import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useLogin } from "../hooks/useLogin";
import { isValidEmail, isValidPassword } from "../utils/validation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useLogin();

  const handleSubmit = () => {
    login(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Email Address"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            autoComplete="email"
            autoFocus
            error={!!email && !isValidEmail(email)}
            helperText={
              email && !isValidEmail(email)
                ? "Please enter a valid email address."
                : ""
            }
          />
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!password && !isValidPassword(password)}
            autoComplete="current-password"
            helperText={
              password && !isValidPassword(password)
                ? "Password must be at least 6 characters."
                : ""
            }
          />
          <Grid container flexDirection={"column"}>
            <Grid>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
                disabled={
                  loading || !isValidEmail(email) || !isValidPassword(password)
                }
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Grid>
            <Grid>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => window.history.back()}
                disabled={loading}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
