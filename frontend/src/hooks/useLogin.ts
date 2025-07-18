import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSnackbar from "./useSnackbar";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      showSnackbar("Logged in successfully!", "success");

      await new Promise(res => setTimeout(res, 1000));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      showSnackbar("Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
