import { useState } from "react";
import { getAccessToken } from "../auth";

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteUser = async (userId: number): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      const token = getAccessToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
