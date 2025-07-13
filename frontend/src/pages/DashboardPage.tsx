import { useEffect, useState } from 'react';
import { getAccessToken } from '../auth';

type User = {
  id: number;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setError('You are not logged in.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data.user);
      } catch (err: any) {
        setError(err.message || 'Error fetching user');
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <p>Welcome, <strong>{user.email}</strong></p>
          <p>User ID: {user.id}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
}
