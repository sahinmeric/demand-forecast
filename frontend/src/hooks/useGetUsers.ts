import { useEffect, useState } from "react";
import { getAccessToken } from "../auth";
import type { User } from "../types";

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTimeout(() => {
        setUsers(data.users);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}
