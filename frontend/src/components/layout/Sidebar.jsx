import { Home, Box, Database, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
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
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { icon: Home, label: 'Panel', path: '/' },
        { icon: Database, label: 'Dolaplar', path: '/cabinets' },
        { icon: Box, label: 'Ürünler', path: '/products' },
        { icon: Settings, label: 'Ayarlar', path: '/settings' },
    ];

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
