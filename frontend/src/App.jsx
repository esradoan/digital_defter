import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Cabinets from './pages/Cabinets';
import CabinetDetail from './pages/CabinetDetail';
import Products from './pages/Products';
import Protocols from './pages/Protocols';
import LabNotebook from './pages/LabNotebook';
import Devices from './pages/Devices';
import Warehouses from './pages/Warehouses';
import WarehouseDetail from './pages/WarehouseDetail';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Korumalı route: giriş yapılmamışsa login'e yönlendir
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

// Admin korumalı route: admin değilse erişim engellenir
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'Admin') return <div className="p-8 text-center text-muted-foreground">Bu sayfaya erişim yetkiniz yok.</div>;
  return children;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cabinets" element={<Cabinets />} />
                <Route path="/cabinets/:id" element={<CabinetDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/protocols" element={<Protocols />} />
                <Route path="/lab-notebook" element={<LabNotebook />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/warehouses" element={<Warehouses />} />
                <Route path="/warehouses/:id" element={<WarehouseDetail />} />
                <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<div>Sayfa bulunamadı</div>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
