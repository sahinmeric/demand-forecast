import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { isValidEmail, isValidPassword } from "../utils/validation";
import { useRegister } from "../hooks/useRegister";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading } = useRegister();

  const handleSubmit = () => {
    register(email, password);
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
          Register
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
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            error={!!email && !isValidEmail(email)}
            helperText={
              email && !isValidEmail(email)
                ? "Please enter a valid email address."
                : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!password && !isValidPassword(password)}
            helperText={
              password && !isValidPassword(password)
                ? "Password must be at least 6 characters."
                : ""
            }
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  loading || !isValidEmail(email) || !isValidPassword(password)
                }
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
