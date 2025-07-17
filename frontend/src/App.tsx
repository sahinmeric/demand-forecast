import { Routes, Route, Navigate} from 'react-router-dom';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import SalesTablePage from './pages/SalesTablePage';
import ForecastPage from './pages/ForecastPage';
import ForecastChartPage from './pages/ForecastChart';
import HomePage from './pages/HomePage';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated } from './auth';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><SalesTablePage /></PrivateRoute>} />
      <Route path="/forecast" element={<PrivateRoute><ForecastPage /></PrivateRoute>} />
      <Route path="/charts" element={<PrivateRoute><ForecastChartPage /></PrivateRoute>} />
    </Routes>
    </>
  );
}

export default App;
