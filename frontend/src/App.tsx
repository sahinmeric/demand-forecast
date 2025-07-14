import { Routes, Route, Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import { logout } from './auth';
import UploadPage from './pages/UploadPage';
import SalesTablePage from './pages/SalesTablePage';
import ForecastPage from './pages/ForecastPage';
import ForecastChartPage from './pages/ForecastChart';

function App() {

  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/upload">Upload</Link> | 
        <Link to="/sales">Sales Data</Link> |
        <Link to="/forecast">Forecasts</Link> |
        <Link to="/charts">Charts</Link> |
      <button onClick={() => { logout(); alert('Logged out'); }}>Logout</button>
      </nav>
      <Routes>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/sales" element={<SalesTablePage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/charts" element={<ForecastChartPage />} />
      </Routes>
    </div>
  );
}

export default App;
