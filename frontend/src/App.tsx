import { Routes, Route, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import { logout } from './auth';
import UploadPage from './pages/UploadPage';

function App() {

  return (
    <div>
      <nav>
      <Link to="/login">Login</Link> | 
      <Link to="/register">Register</Link> | 
      <Link to="/dashboard">Dashboard</Link> |
      <Link to="/upload">Upload</Link> | 
      <button onClick={() => { logout(); alert('Logged out'); }}>Logout</button>    </nav>
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </div>
  );
}

export default App;
