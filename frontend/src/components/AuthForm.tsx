import { useState } from 'react';

type Props = {
  mode: 'login' | 'register';
};

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:3000/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (mode === 'login') {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setSuccess('Logged in successfully!');
      } else {
        setSuccess('Registered successfully! Now you can log in.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
