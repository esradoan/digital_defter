import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Cabinets from './pages/Cabinets';
import CabinetDetail from './pages/CabinetDetail';
import Products from './pages/Products';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cabinets" element={<Cabinets />} />
            <Route path="/cabinets/:id" element={<CabinetDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<div>Sayfa bulunamadı</div>} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
