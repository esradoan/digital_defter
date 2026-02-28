import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, PackageOpen, AlertTriangle } from 'lucide-react';
import cabinetService from '../services/cabinetService';
import productService from '../services/productService';

export default function Dashboard() {
    const [cabinetCount, setCabinetCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [criticalCount, setCriticalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cabinets, products] = await Promise.all([
                    cabinetService.getAll(),
                    productService.getAll()
                ]);
                setCabinetCount(cabinets.length);
                setProductCount(products.length);
                // Kritik stok: miktarı 5 veya altında olan ürünler
                const critical = products.filter(p => p.quantity !== undefined && p.quantity <= 5);
                setCriticalCount(critical.length);
            } catch (err) {
                console.error('Dashboard verisi yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { title: 'Toplam Dolap', value: cabinetCount, icon: Database, color: 'text-sky-400', bgColor: 'bg-sky-500/10' },
        { title: 'Toplam Ürün', value: productCount, icon: PackageOpen, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { title: 'Kritik Stok', value: criticalCount, icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10', danger: true },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Genel Bakış</h1>
                <p className="text-muted-foreground mt-1">Laboratuvar envanterinizin özeti</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-4xl font-bold ${stat.danger ? 'text-red-400' : 'text-primary'}`}>
                                {loading ? '…' : stat.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
