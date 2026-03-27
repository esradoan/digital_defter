import { Home, Box, Database, Settings, LogOut, FileText, User, BookOpen, Monitor, Warehouse as WarehouseIcon, Users } from 'lucide-react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Sidebar({ mobile = false, onNavigate }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'Panel', path: '/' },
        { icon: WarehouseIcon, label: 'Ana Depolar', path: '/warehouses' },
        { icon: Database, label: 'Dolaplar', path: '/cabinets' },
        { icon: Box, label: 'Ürünler', path: '/products' },
        { icon: FileText, label: 'Protokoller', path: '/protocols' },
        { icon: Monitor, label: 'Cihazlar', path: '/devices' },
        { icon: BookOpen, label: 'Lab Defteri', path: '/lab-notebook' },
        { icon: Users, label: 'Kullanıcılar', path: '/users', adminOnly: true },
        { icon: Settings, label: 'Ayarlar', path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        onNavigate?.();
        navigate('/login');
    };

    return (
        <aside
            className={cn(
                'border-border bg-card transition-colors duration-300',
                mobile
                    ? 'flex h-full flex-col'
                    : 'fixed left-0 top-0 hidden h-screen w-sidebar border-r md:flex'
            )}
        >
            <div className="p-6">
                <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary">
                    🧪 LabManager
                </h2>
            </div>

            <Separator />

            <nav className="mt-2 flex flex-1 flex-col gap-1 p-3">
                {menuItems
                    .filter(item => !item.adminOnly || (user && user.role === 'Admin'))
                    .map((item) => {
                        const isActive = item.path === '/'
                            ? location.pathname === item.path
                            : Boolean(
                                matchPath({ path: item.path, end: true }, location.pathname) ||
                                matchPath({ path: `${item.path}/*`, end: false }, location.pathname)
                            );

                        return (
                            <Link key={item.path} to={item.path} onClick={() => onNavigate?.()}>
                                <Button
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={`h-11 w-full justify-start gap-3 text-[15px] ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
            </nav>

            <div className="space-y-1 p-3">
                <Separator className="mb-3" />

                {user && (
                    <div className="mb-2 flex items-center gap-3 px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/20">
                            {user.profileImageUrl ? (
                                <img src={`http://localhost:5274${user.profileImageUrl}`} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                <User size={16} className="text-primary" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.username}</p>
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="h-11 w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut size={20} />
                    <span>Çıkış Yap</span>
                </Button>
            </div>
        </aside>
    );
}
