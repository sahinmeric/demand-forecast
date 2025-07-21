import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout, isAuthenticated, getUserRole } from "../auth";

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated()) return null;

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Demand Forecast
        </Typography>
        <Button color="inherit" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
        <Button color="inherit" onClick={() => navigate("/upload")}>
          Upload
        </Button>
        <Button color="inherit" onClick={() => navigate("/sales")}>
          Sales
        </Button>
        <Button color="inherit" onClick={() => navigate("/forecast")}>
          Forecasts
        </Button>
        <Button color="inherit" onClick={() => navigate("/charts")}>
          Charts
        </Button>
        {getUserRole() === "admin" && (
          <Button color="inherit" onClick={() => navigate("/admin")}>
            Admin
          </Button>
        )}
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
