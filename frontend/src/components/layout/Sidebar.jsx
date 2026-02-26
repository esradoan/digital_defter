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
        <div className="w-sidebar bg-card border-r border-border-custom flex flex-col h-screen fixed left-0 top-0 transition-colors duration-300">
            {/* Header */}
            <div className="p-6 border-b border-border-custom">
                <h2 className="text-xl font-bold text-primary m-0 flex items-center gap-2">
                    🧪 LabManager
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 flex flex-col gap-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg text-muted transition-all duration-200 hover:bg-primary hover:text-white ${location.pathname === item.path ? 'bg-primary text-white' : ''
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border-custom">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-muted w-full transition-all duration-200 hover:bg-hover-bg hover:text-primary"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="font-medium">
                        {theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
                    </span>
                </button>
                <button className="flex items-center gap-3 py-3 px-4 rounded-lg text-muted w-full transition-all duration-200 hover:bg-hover-bg hover:text-primary">
                    <LogOut size={20} />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
}
