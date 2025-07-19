import { useState } from "react";
import { getAccessToken } from "../auth";

type SaveResult = {
  success: boolean;
  message: string;
};

export function useSaveCleanData() {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState("");

  const saveToDatabase = async (
    validRows: Record<string, unknown>[],
    fileName: string
  ): Promise<SaveResult> => {
    setSaving(true);
    setSaveMessage("");
    setError("");

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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveMessage(`✅ ${data.message}`);
      return { success: true, message: data.message };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setSaveMessage(`❌ Save failed: ${msg}`);
      setSaving(false);
      return { success: false, message: msg };
    }
  };

  return {
    saving,
    saveMessage,
    error,
    saveToDatabase,
  };
}
