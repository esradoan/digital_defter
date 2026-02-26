import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, PackageOpen, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { title: 'Toplam Dolap', value: '8', icon: Database, color: 'text-sky-400', bgColor: 'bg-sky-500/10' },
        { title: 'Toplam Ürün', value: '245', icon: PackageOpen, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
        { title: 'Kritik Stok', value: '3', icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10', danger: true },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Genel Bakış</h1>
                <p className="text-muted-foreground mt-1">Laboratuvar envanterinizin özeti</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
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
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
