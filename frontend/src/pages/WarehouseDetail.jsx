import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash, Trash2, FolderPlus, Search, Package, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import warehouseService from '../services/warehouseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UNITS = ['adet', 'litre', 'ml', 'gram', 'kg', 'kutu', 'paket', 'şişe', 'tüp'];

export default function WarehouseDetail() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [warehouseName, setWarehouseName] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openCategoryId, setOpenCategoryId] = useState(null);

    // Ürün dialog
    const [isItemOpen, setIsItemOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemForm, setItemForm] = useState({ name: '', quantity: '', unit: 'adet', description: '', categoryId: '' });
    const [saving, setSaving] = useState(false);

    // Kategori dialog
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const [itemsRes, catsRes, whRes] = await Promise.all([
                warehouseService.getItems(id),
                warehouseService.getCategories(),
                warehouseService.getAll()
            ]);
            setItems(itemsRes.data || itemsRes);
            setCategories(catsRes.data || catsRes);
            const allWarehouses = whRes.data || whRes;
            const current = allWarehouses.find(w => w.id === parseInt(id));
            if (current) setWarehouseName(current.name);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddItem = () => {
        setEditingItem(null);
        setItemForm({ name: '', quantity: '', unit: 'adet', description: '', categoryId: '' });
        setIsItemOpen(true);
    };

    const openEditItem = (item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            quantity: String(item.quantity),
            unit: item.unit,
            description: item.description || '',
            categoryId: item.warehouseCategoryId ? String(item.warehouseCategoryId) : ''
        });
        setIsItemOpen(true);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        if (!itemForm.name.trim() || !itemForm.quantity) return;
        setSaving(true);
        try {
            const data = {
                name: itemForm.name.trim(),
                quantity: parseFloat(itemForm.quantity),
                unit: itemForm.unit,
                description: itemForm.description.trim() || null,
                warehouseId: parseInt(id),
                warehouseCategoryId: itemForm.categoryId ? parseInt(itemForm.categoryId) : null
            };
            if (editingItem) {
                await warehouseService.updateItem(editingItem.id, data);
            } else {
                await warehouseService.createItem(data);
            }
            setIsItemOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kaydetme hatası:', err);
            alert('Ürün kaydedilirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteItem = async (itemId, name) => {
        if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
        try {
            await warehouseService.deleteItem(itemId);
            fetchData();
        } catch (err) {
            console.error('Silme hatası:', err);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        try {
            await warehouseService.createCategory(newCatName.trim());
            setNewCatName('');
            setIsCatOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kategori hatası:', err);
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (!window.confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) return;
        try {
            await warehouseService.deleteCategory(catId);
            fetchData();
        } catch (err) {
            console.error('Kategori silme hatası:', err);
        }
    };

    // Filtreleme
    const filteredItems = items.filter(i =>
        i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const uncategorized = filteredItems.filter(i => !i.warehouseCategoryId);
    const groupedByCategory = categories.map(cat => ({
        ...cat,
        items: filteredItems.filter(i => i.warehouseCategoryId === cat.id)
    }));

    // Envanter satırı
    const ItemRow = ({ item }) => (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors">
            <Package size={18} className="text-primary/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{item.name}</span>
                </div>
                {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                    <span className="text-lg font-bold text-primary">{item.quantity}</span>
                    <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                </div>
                <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-sky-400 hover:text-sky-300" onClick={() => openEditItem(item)}>
                        <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleDeleteItem(item.id, item.name)}>
                        <Trash size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
                <Link to="/warehouses">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{warehouseName}</h1>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">Stok envanterini yönetin • {items.length} ürün</p>
                </div>
                <Button onClick={openAddItem} className="w-full gap-2 sm:w-auto">
                    <Plus size={16} /> Ürün Ekle
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün ara..." className="pl-10" />
            </div>

            {/* Kategori Başlığı */}
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Layers size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground m-0">Stok Kategorileri</h2>
                <span className="flex-1 text-sm text-muted-foreground">— Kategoriye tıklayarak ürünleri görüntüleyin</span>
                <Button variant="outline" size="sm" onClick={() => setIsCatOpen(true)} className="w-full gap-1.5 sm:w-auto">
                    <FolderPlus size={15} /> Kategori Ekle
                </Button>
            </div>

            {/* Kategoriler */}
            <div className="space-y-3">
                {groupedByCategory.map((cat) => (
                    <Card key={cat.id}>
                        <Collapsible open={openCategoryId === cat.id} onOpenChange={() => setOpenCategoryId(openCategoryId === cat.id ? null : cat.id)}>
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === cat.id ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-muted-foreground" />}
                                        <Package size={18} className="text-primary/70" />
                                        <span className="font-semibold text-foreground">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{cat.items.length} ürün</Badge>
                                        <Trash2 size={14} className="text-muted-foreground hover:text-red-400 cursor-pointer transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }} />
                                    </div>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    {cat.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">Bu kategoride henüz ürün yok</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {cat.items.map(i => <ItemRow key={i.id} item={i} />)}
                                        </div>
                                    )}
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}

                {uncategorized.length > 0 && (
                    <Card>
                        <Collapsible open={openCategoryId === 'unc'} onOpenChange={() => setOpenCategoryId(openCategoryId === 'unc' ? null : 'unc')}>
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === 'unc' ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} className="text-muted-foreground" />}
                                        <Package size={18} className="text-muted-foreground" />
                                        <span className="font-semibold text-foreground">Kategorisiz</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{uncategorized.length} ürün</Badge>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    <div className="space-y-2">
                                        {uncategorized.map(i => <ItemRow key={i.id} item={i} />)}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )}

                {items.length === 0 && categories.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Package size={48} className="text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-1">Henüz stok yok</h3>
                            <p className="text-sm text-muted-foreground mb-4">İlk ürününüzü ekleyerek envanter oluşturmaya başlayın</p>
                            <Button onClick={openAddItem} className="gap-2"><Plus size={16} /> Ürün Ekle</Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Ürün Ekleme/Düzenleme Dialog */}
            <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Ürün Düzenle' : 'Ürün Ekle'}</DialogTitle>
                        <DialogDescription>Stok bilgilerini girin.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveItem} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Ürün Adı *</label>
                            <Input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Örn: Etanol %96" required autoFocus />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori</label>
                            <Select value={itemForm.categoryId} onValueChange={val => setItemForm({ ...itemForm, categoryId: val })}>
                                <SelectTrigger><SelectValue placeholder="Kategori seçin (opsiyonel)" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Miktar *</label>
                                <Input type="number" step="0.01" min="0" value={itemForm.quantity} onChange={e => setItemForm({ ...itemForm, quantity: e.target.value })} placeholder="0" required />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Birim</label>
                                <Select value={itemForm.unit} onValueChange={val => setItemForm({ ...itemForm, unit: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Açıklama</label>
                            <textarea value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                                placeholder="Lot no, son kullanma tarihi vb."
                                rows={2} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                        </div>
                        <Button type="submit" className="w-full" disabled={!itemForm.name.trim() || !itemForm.quantity || saving}>
                            <Plus size={16} className="mr-2" />
                            {saving ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Ürün Ekle')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Kategori Dialog */}
            <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        <DialogDescription>Stok kategorisi oluşturun.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori Adı</label>
                            <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Örn: Kimyasallar, Cam Malzemeler..." required />
                        </div>
                        <Button type="submit" className="w-full"><FolderPlus size={16} className="mr-2" /> Kategori Oluştur</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
