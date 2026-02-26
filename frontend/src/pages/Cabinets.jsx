import { useState, useEffect } from 'react';
import { Thermometer, Box, Archive, Plus, Edit as EditIcon, Save } from 'lucide-react';
import cabinetService from '../services/cabinetService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Cabinets() {
    const [cabinets, setCabinets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 0,
        temperatureCondition: '',
        capacityInfo: ''
    });

    useEffect(() => {
        fetchCabinets();
    }, []);

    const fetchCabinets = async () => {
        try {
            const data = await cabinetService.getAll();
            setCabinets(data);
        } catch (err) {
            setError('Dolap verileri yüklenirken bir hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingId(null);
        setFormData({ name: '', type: 0, temperatureCondition: '', capacityInfo: '' });
        setIsModalOpen(true);
    };

    const handleEditClick = (e, cabinet) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(cabinet.id);
        setFormData({
            name: cabinet.name,
            type: cabinet.type,
            temperatureCondition: cabinet.temperatureCondition || '',
            capacityInfo: cabinet.capacityInfo || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', type: 0, temperatureCondition: '', capacityInfo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await cabinetService.update(editingId, formData);
            } else {
                await cabinetService.create(formData);
            }
            await fetchCabinets();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert('İşlem sırasında bir hata oluştu!');
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            0: 'Buzdolabı',
            1: 'Derin Dondurucu',
            2: 'Ultra Derin Dondurucu',
            3: 'Oda'
        };
        return labels[type] || 'Bilinmiyor';
    };

    const getTypeVariant = (type) => {
        const variants = {
            0: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
            1: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
            2: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
            3: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
        };
        return variants[type] || '';
    };

    if (loading) return <div className="p-4 text-muted-foreground">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-destructive">{error}</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dolaplar</h1>
                    <p className="text-muted-foreground mt-1">Tüm depolama alanlarınızı yönetin</p>
                </div>
                <Button onClick={handleCreateClick} className="gap-2 shadow-md shadow-primary/20">
                    <Plus size={20} /> Yeni Dolap
                </Button>
            </div>

            {/* Empty State */}
            {cabinets.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Archive size={48} className="mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground text-lg">Henüz hiç dolap eklenmemiş.</p>
                        <Button onClick={handleCreateClick} variant="outline" className="mt-4 gap-2">
                            <Plus size={16} /> İlk dolabınızı ekleyin
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                /* Cabinet Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cabinets.map((cabinet) => (
                        <Card
                            key={cabinet.id}
                            className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Link to={`/cabinets/${cabinet.id}`} className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                                            {cabinet.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={getTypeVariant(cabinet.type)}>
                                            {getTypeLabel(cabinet.type)}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={(e) => handleEditClick(e, cabinet)}
                                            title="Düzenle"
                                        >
                                            <EditIcon size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex gap-4 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Thermometer size={14} />
                                        <span>{cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Box size={14} />
                                        <span>{cabinet.capacityInfo || 'Kapasite Yok'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal — shadcn Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {editingId ? 'Dolabı Düzenle' : 'Yeni Dolap Ekle'}
                        </DialogTitle>
                        <DialogDescription>
                            Dolap bilgilerini girin veya güncelleyin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Dolap Adı</label>
                            <Input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Örn: Ana Laboratuvar Buzdolabı"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Tip</label>
                            <Select
                                value={String(formData.type)}
                                onValueChange={(val) => setFormData({ ...formData, type: parseInt(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tip seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Buzdolabı (+4°C)</SelectItem>
                                    <SelectItem value="1">Derin Dondurucu (-20°C)</SelectItem>
                                    <SelectItem value="2">Ultra Derin Dondurucu (-80°C)</SelectItem>
                                    <SelectItem value="3">Oda / Raf (Normal Sıcaklık)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Sıcaklık</label>
                                <Input
                                    type="text"
                                    value={formData.temperatureCondition}
                                    onChange={(e) => setFormData({ ...formData, temperatureCondition: e.target.value })}
                                    placeholder="+4°C"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Kapasite Bilgisi</label>
                                <Input
                                    type="text"
                                    value={formData.capacityInfo}
                                    onChange={(e) => setFormData({ ...formData, capacityInfo: e.target.value })}
                                    placeholder="5 Raf / 200 Kutu"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="mt-2 gap-2 w-full">
                            <Save size={18} />
                            {editingId ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
