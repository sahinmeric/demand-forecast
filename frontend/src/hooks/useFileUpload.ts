import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { UploadPreview } from "../types";

type UseFileUploadReturn = {
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  isDragActive: boolean;
  preview: UploadPreview | null;
  loading: boolean;
  error: string;
};

export const useFileUpload = (
  onUploadComplete: (data: UploadPreview) => void
): UseFileUploadReturn => {
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setError("");
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/files/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setTimeout(() => {
          onUploadComplete(data);
          setPreview(data);
          setLoading(false);
        }, 2000);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected upload error.";
        setError(message);
        setLoading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xlsx", ".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    preview,
    loading,
    error,
  };
};
