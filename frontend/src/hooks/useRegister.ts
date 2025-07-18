import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSnackbar from "./useSnackbar";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Registration failed");
      }

      showSnackbar("Registration successful! Redirecting to login...", "success");

      await new Promise(res => setTimeout(res, 1000));
      navigate("/login");
    } catch (err) {
      console.error("Register failed:", err);
      const errorMsg =
        err instanceof Error ? `Registration failed: ${err.message}` : "Registration failed.";
      showSnackbar(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
