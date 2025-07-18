import { useEffect, useState } from "react";
import { getAccessToken } from "../auth";
import type { SalesRow } from "../types";

export function useSalesData() {
  const [rows, setRows] = useState<SalesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/files/sales-data`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRows(data.records);
      } catch (err) {
        setError((err as Error).message || "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { rows, loading, error };
}
