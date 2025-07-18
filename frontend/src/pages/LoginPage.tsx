import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLogin } from "../hooks/useLogin";


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useLogin();


  const handleSubmit = () => {
    login(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5">Login</Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={10} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
