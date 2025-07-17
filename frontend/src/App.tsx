import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import SalesTablePage from './pages/SalesTablePage';
import ForecastPage from './pages/ForecastPage';
import ForecastChartPage from './pages/ForecastChart';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/sales" element={<SalesTablePage />} />
      <Route path="/forecast" element={<ForecastPage />} />
      <Route path="/charts" element={<ForecastChartPage />} />
    </Routes>
  );
}

export default App;
