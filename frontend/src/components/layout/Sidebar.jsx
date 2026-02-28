import { Home, Box, Database, Settings, LogOut, Sun, Moon, FileText, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Panel', path: '/' },
        { icon: Database, label: 'Dolaplar', path: '/cabinets' },
        { icon: Box, label: 'Ürünler', path: '/products' },
        { icon: FileText, label: 'Protokoller', path: '/protocols' },
        { icon: Settings, label: 'Ayarlar', path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <TooltipProvider>
            <div className="w-sidebar bg-card border-r border-border flex flex-col h-screen fixed left-0 top-0 transition-colors duration-300">
                {/* Header */}
                <div className="p-6">
                    <h2 className="text-xl font-bold text-primary m-0 flex items-center gap-2">
                        🧪 LabManager
                    </h2>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Tooltip key={item.path}>
                                <TooltipTrigger asChild>
                                    <Link to={item.path}>
                                        <Button
                                            variant={isActive ? 'default' : 'ghost'}
                                            className={`w-full justify-start gap-3 h-11 text-[15px] ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                                }`}
                                        >
                                            <item.icon size={20} />
                                            <span>{item.label}</span>
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 space-y-1">
                    <Separator className="mb-3" />

                    {/* Kullanıcı bilgisi */}
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User size={16} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        onClick={toggleTheme}
                        className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}

