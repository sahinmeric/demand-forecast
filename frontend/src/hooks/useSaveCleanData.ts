import { useState } from "react";
import { getAccessToken } from "../auth";

type SaveResult = {
  success: boolean;
  message: string;
};

export function useSaveCleanData() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveToDatabase = async (
    validRows: Record<string, unknown>[],
    fileName: string
  ): Promise<SaveResult> => {
    setSaving(true);
    setMessage("");

    try {
      const token = getAccessToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileName, rows: validRows }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(`✅ ${data.message}`);
      return { success: true, message: data.message };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setMessage(`❌ Save failed: ${errorMsg}`);
      return { success: false, message: errorMsg };
    } finally {
      setSaving(false);
    }
  };

  return { saveToDatabase, saving, message };
}
