import { Home, Box, Database, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { icon: Home, label: 'Panel', path: '/' },
        { icon: Database, label: 'Dolaplar', path: '/cabinets' },
        { icon: Box, label: 'Ürünler', path: '/products' },
        { icon: Settings, label: 'Ayarlar', path: '/settings' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="logo-text">
                    🧪 LabManager
                </h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={toggleTheme} className="nav-item full-width">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="nav-label">
                        {theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
                    </span>
                </button>
                <button className="nav-item full-width">
                    <LogOut size={20} />
                    <span className="nav-label">Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
}
