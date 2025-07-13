import { Routes, Route, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import { logout } from './auth';
function App() {

  return (
    <div>
      <nav>
      <Link to="/login">Login</Link> | 
      <Link to="/register">Register</Link> | 
      <Link to="/dashboard">Dashboard</Link> | 
      <button onClick={() => { logout(); alert('Logged out'); }}>Logout</button>    </nav>
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
