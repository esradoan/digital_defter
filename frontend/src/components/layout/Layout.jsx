import { useEffect, useMemo, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const routeTitles = [
    { path: '/', title: 'Panel', end: true },
    { path: '/warehouses', title: 'Ana Depolar', end: true },
    { path: '/warehouses/:id', title: 'Depo Detayı' },
    { path: '/cabinets', title: 'Dolaplar', end: true },
    { path: '/cabinets/:id', title: 'Dolap Detayı' },
    { path: '/products', title: 'Ürünler', end: true },
    { path: '/protocols', title: 'Protokoller', end: true },
    { path: '/devices', title: 'Cihazlar', end: true },
    { path: '/lab-notebook', title: 'Lab Defteri', end: true },
    { path: '/users', title: 'Kullanıcı Yönetimi', end: true },
    { path: '/settings', title: 'Ayarlar', end: true },
];

function getPageTitle(pathname) {
    const matchedRoute = routeTitles.find(route =>
        matchPath({ path: route.path, end: route.end ?? false }, pathname)
    );

    return matchedRoute?.title || 'LabManager';
}

export default function Layout({ children }) {
    const location = useLocation();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isMobileViewport, setIsMobileViewport] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768;
    });

    const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const handleViewportChange = (event) => {
            setIsMobileViewport(event.matches);
            if (!event.matches) {
                setIsMobileNavOpen(false);
            }
        };

        setIsMobileViewport(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleViewportChange);

        return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {isMobileViewport && (
                <Dialog open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                    <DialogContent aria-describedby={undefined} className="left-0 top-0 h-dvh max-h-dvh w-[280px] max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r border-border bg-card p-0 data-[state=closed]:slide-out-to-left data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left data-[state=open]:slide-in-from-top-0 md:hidden">
                        <DialogTitle className="sr-only">Navigasyon Menüsü</DialogTitle>
                        <Sidebar mobile onNavigate={() => setIsMobileNavOpen(false)} />
                    </DialogContent>
                </Dialog>
            )}

            <div className="min-h-screen md:ml-sidebar">
                <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur md:hidden">
                    <div className="flex h-16 items-center gap-3 px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={() => setIsMobileNavOpen(true)}
                            aria-label="Menüyü aç"
                        >
                            <Menu size={20} />
                        </Button>
                        <span className="truncate text-base font-semibold text-foreground">
                            {pageTitle}
                        </span>
                    </div>
                </header>

                <main className="p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
