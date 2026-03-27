import { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus, Edit2, Trash2, MapPin, Package, Search, Save } from 'lucide-react';
import warehouseService from '../services/warehouseService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Depo dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', location: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await warehouseService.getAll();
            setWarehouses(res.data || res);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddDialog = () => {
        setEditingWarehouse(null);
        setForm({ name: '', description: '', location: '' });
        setIsDialogOpen(true);
    };

    const openEditDialog = (e, warehouse) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingWarehouse(warehouse);
        setForm({ name: warehouse.name, description: warehouse.description || '', location: warehouse.location || '' });
        setIsDialogOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            const data = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                location: form.location.trim() || null
            };
            if (editingWarehouse) {
                await warehouseService.update(editingWarehouse.id, data);
            } else {
                await warehouseService.create(data);
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kaydetme hatası:', err);
            alert('Depo kaydedilirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (e, id, name) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`"${name}" deposunu ve içindeki tüm ürünleri silmek istediğinize emin misiniz?`)) return;
        try {
            await warehouseService.delete(id);
            fetchData();
        } catch (err) {
            console.error('Silme hatası:', err);
            alert('Depo silinirken hata oluştu.');
        }
    };

    const filtered = warehouses.filter(w =>
        w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Depolar</h1>
                    <p className="text-muted-foreground mt-1">Ana stok depolarınızı yönetin</p>
                </div>
                <Button onClick={openAddDialog} className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                    <Plus size={20} /> Yeni Depo
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Depo ara..."
                    className="pl-10"
                />
            </div>

            {/* Empty State */}
            {warehouses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <WarehouseIcon size={48} className="mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground text-lg">Henüz hiç depo eklenmemiş.</p>
                        <Button onClick={openAddDialog} variant="outline" className="mt-4 gap-2">
                            <Plus size={16} /> İlk deponuzu ekleyin
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((warehouse) => (
                        <Card
                            key={warehouse.id}
                            className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <Link to={`/warehouses/${warehouse.id}`} className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                                            {warehouse.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost" size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={(e) => openEditDialog(e, warehouse)}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-400"
                                            onClick={(e) => handleDelete(e, warehouse.id, warehouse.name)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {warehouse.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{warehouse.description}</p>
                                )}
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap">
                                    {warehouse.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} />
                                            <span>{warehouse.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Package size={14} />
                                        <span>{warehouse.itemCount} ürün</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingWarehouse ? 'Depoyu Düzenle' : 'Yeni Depo Ekle'}</DialogTitle>
                        <DialogDescription>Depo bilgilerini girin.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Depo Adı *</label>
                            <Input
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Örn: Ana Depo"
                                required autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Konum</label>
                            <Input
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="Örn: Bodrum Kat, B-105"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Açıklama</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Depo hakkında kısa bilgi..."
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <Button type="submit" className="mt-2 gap-2 w-full" disabled={saving}>
                            <Save size={18} />
                            {saving ? 'Kaydediliyor...' : (editingWarehouse ? 'Güncelle' : 'Kaydet')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
