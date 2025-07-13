import { Routes, Route, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';

function App() {

  const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  alert('Logged out');
};

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <button onClick={handleLogout}>Logout</button>
      </nav>
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
      </Routes>
    </div>
  );
}

export default App;
