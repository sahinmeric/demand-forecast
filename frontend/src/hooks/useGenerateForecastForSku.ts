import { useState } from "react";
import { getAccessToken } from "../auth";

export function useGenerateForecastForSku() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generate = async (sku: string) => {
    setLoading(true);
    setMessage("");

    try {
      const token = getAccessToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forecast/generate/${sku}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(`✅ ${data.message}`);
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessage(`❌ ${msg}`);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, message };
}
