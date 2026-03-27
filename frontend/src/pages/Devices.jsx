import { useState, useEffect, useRef } from 'react';
import { Monitor, Plus, Trash, Trash2, Edit2, FolderPlus, ChevronDown, ChevronRight, Layers, Cpu, Search, FileText, Upload } from 'lucide-react';
import deviceService from '../services/deviceService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Devices() {
    const [devices, setDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Cihaz ekleme/düzenleme dialog
    const [isDeviceOpen, setIsDeviceOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [deviceForm, setDeviceForm] = useState({ name: '', brandModel: '', description: '', categoryId: '' });
    const [saving, setSaving] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const fileInputRef = useRef(null);

    // Kategori dialog
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [devicesRes, categoriesRes] = await Promise.all([
                deviceService.getAll(),
                deviceService.getCategories()
            ]);
            setDevices(devicesRes.data || devicesRes);
            setCategories(categoriesRes.data || categoriesRes);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const openAddDialog = () => {
        setEditingDevice(null);
        setDeviceForm({ name: '', brandModel: '', description: '', categoryId: '' });
        setSelectedPdf(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsDeviceOpen(true);
    };

    const openEditDialog = (device) => {
        setEditingDevice(device);
        setDeviceForm({
            name: device.name,
            brandModel: device.brandModel || '',
            description: device.description || '',
            categoryId: device.deviceCategoryId ? String(device.deviceCategoryId) : ''
        });
        setSelectedPdf(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsDeviceOpen(true);
    };

    const handleSaveDevice = async (e) => {
        e.preventDefault();
        if (!deviceForm.name.trim()) return;

        setSaving(true);
        try {
            const data = {
                name: deviceForm.name.trim(),
                brandModel: deviceForm.brandModel.trim() || null,
                description: deviceForm.description.trim() || null,
                deviceCategoryId: deviceForm.categoryId ? parseInt(deviceForm.categoryId) : null
            };

            let targetId = editingDevice?.id;

            if (editingDevice) {
                await deviceService.update(editingDevice.id, data);
            } else {
                const newDevice = await deviceService.create(data);
                targetId = newDevice.data?.id || newDevice.id; // fallback if data is nested
            }

            // PDF seçiliyse yükle
            if (selectedPdf && targetId) {
                await deviceService.uploadManual(targetId, selectedPdf);
            }

            setIsDeviceOpen(false);
            setDeviceForm({ name: '', brandModel: '', description: '', categoryId: '' });
            setSelectedPdf(null);
            setEditingDevice(null);
            fetchData();
        } catch (err) {
            console.error('Kaydetme hatası:', err);
            alert('Cihaz kaydedilirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`"${name}" cihazını silmek istediğinize emin misiniz?`)) return;
        try {
            await deviceService.delete(id);
            fetchData();
        } catch (err) {
            console.error('Silme hatası:', err);
            alert('Cihaz silinirken hata oluştu.');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await deviceService.createCategory(newCategoryName.trim());
            setNewCategoryName('');
            setIsCategoryOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kategori ekleme hatası:', err);
            alert('Kategori eklenirken hata oluştu.');
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (!window.confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) return;
        try {
            await deviceService.deleteCategory(catId);
            fetchData();
        } catch (err) {
            console.error('Kategori silme hatası:', err);
            alert('Kategori silinirken hata oluştu.');
        }
    };

    // Arama filtresi
    const filteredDevices = devices.filter(d =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.brandModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Kategorilere göre grupla
    const uncategorized = filteredDevices.filter(d => !d.deviceCategoryId);
    const groupedByCategory = categories.map(cat => ({
        ...cat,
        items: filteredDevices.filter(d => d.deviceCategoryId === cat.id)
    }));

    const DeviceCard = ({ device }) => (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors">
            <div className="flex-shrink-0">
                <Cpu size={20} className="text-sky-400" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{device.name}</h4>
                {device.brandModel && (
                    <p className="text-sm text-muted-foreground mt-0.5">{device.brandModel}</p>
                )}
                {device.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{device.description}</p>
                )}
                <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground items-center">
                    {device.categoryName && (
                        <>
                            <span>{device.categoryName}</span>
                            <span>•</span>
                        </>
                    )}
                    <span>{new Date(device.createdAt).toLocaleDateString('tr-TR')}</span>

                    {device.manualFileUrl && (
                        <>
                            <span>•</span>
                            <a
                                href={`http://localhost:5274${device.manualFileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FileText size={14} /> PDF Kılavuz
                            </a>
                        </>
                    )}
                </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                    onClick={() => openEditDialog(device)}
                    title="Düzenle"
                >
                    <Edit2 size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleDelete(device.id, device.name)}
                    title="Sil"
                >
                    <Trash size={16} />
                </Button>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Cihazlar</h1>
                    <p className="text-muted-foreground mt-1">Laboratuvar cihazlarınızı yönetin</p>
                </div>
                <Button onClick={openAddDialog} className="w-full gap-2 sm:w-auto">
                    <Plus size={16} /> Cihaz Ekle
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cihaz ara..."
                    className="pl-10"
                />
            </div>

            {/* Section Title */}
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Layers size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground m-0">Kategori Bölmeleri</h2>
                <span className="flex-1 text-sm text-muted-foreground">— Kategoriye tıklayarak cihazları görüntüleyin</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCategoryOpen(true)}
                    className="w-full gap-1.5 sm:w-auto"
                >
                    <FolderPlus size={15} /> Kategori Ekle
                </Button>
            </div>

            {/* Kategorilere göre bölmeler */}
            <div className="space-y-3">
                {groupedByCategory.map((cat) => (
                    <Card key={cat.id}>
                        <Collapsible
                            open={openCategoryId === cat.id}
                            onOpenChange={() => setOpenCategoryId(openCategoryId === cat.id ? null : cat.id)}
                        >
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === cat.id
                                            ? <ChevronDown size={18} className="text-primary" />
                                            : <ChevronRight size={18} className="text-muted-foreground" />
                                        }
                                        <Monitor size={18} className="text-primary/70" />
                                        <span className="font-semibold text-foreground">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{cat.items.length} cihaz</Badge>
                                        <Trash2
                                            size={14}
                                            className="text-muted-foreground hover:text-red-400 cursor-pointer transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                                        />
                                    </div>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    {cat.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">Bu kategoride henüz cihaz yok</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {cat.items.map(d => <DeviceCard key={d.id} device={d} />)}
                                        </div>
                                    )}
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}

                {/* Kategorisiz Cihazlar */}
                {uncategorized.length > 0 && (
                    <Card>
                        <Collapsible
                            open={openCategoryId === 'uncategorized'}
                            onOpenChange={() => setOpenCategoryId(openCategoryId === 'uncategorized' ? null : 'uncategorized')}
                        >
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === 'uncategorized'
                                            ? <ChevronDown size={18} className="text-primary" />
                                            : <ChevronRight size={18} className="text-muted-foreground" />
                                        }
                                        <Cpu size={18} className="text-muted-foreground" />
                                        <span className="font-semibold text-foreground">Kategorisiz</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{uncategorized.length} cihaz</Badge>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    <div className="space-y-2">
                                        {uncategorized.map(d => <DeviceCard key={d.id} device={d} />)}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )}

                {devices.length === 0 && categories.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Monitor size={48} className="text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-1">Henüz cihaz yok</h3>
                            <p className="text-sm text-muted-foreground mb-4">İlk cihazınızı ekleyerek başlayın</p>
                            <Button onClick={openAddDialog} className="gap-2">
                                <Plus size={16} /> Cihaz Ekle
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Device Add/Edit Dialog */}
            <Dialog open={isDeviceOpen} onOpenChange={setIsDeviceOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingDevice ? 'Cihaz Düzenle' : 'Cihaz Ekle'}</DialogTitle>
                        <DialogDescription>
                            Cihaz bilgilerini girin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveDevice} className="flex flex-col gap-4 mt-2">
                        {/* Cihaz Adı */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Cihaz Adı *</label>
                            <Input
                                value={deviceForm.name}
                                onChange={e => setDeviceForm({ ...deviceForm, name: e.target.value })}
                                placeholder="Örn: Biyolojik Güvenlik Kabini"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori</label>
                            <Select
                                value={deviceForm.categoryId}
                                onValueChange={val => setDeviceForm({ ...deviceForm, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Marka/Model */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Marka / Model</label>
                            <Input
                                value={deviceForm.brandModel}
                                onChange={e => setDeviceForm({ ...deviceForm, brandModel: e.target.value })}
                                placeholder="Örn: Thermo Fisher 1300 Series"
                            />
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Açıklama / Özellikler</label>
                            <textarea
                                value={deviceForm.description}
                                onChange={e => setDeviceForm({ ...deviceForm, description: e.target.value })}
                                placeholder="Cihazın teknik özellikleri, kullanım amacı vb."
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        {/* PDF Yükleme */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kullanım Kılavuzu (PDF)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    onChange={(e) => setSelectedPdf(e.target.files?.[0])}
                                    className="cursor-pointer"
                                />
                                {editingDevice && editingDevice.manualFileUrl && !selectedPdf && (
                                    <Badge variant="outline" className="shrink-0 flex items-center gap-1 bg-primary/5 text-primary">
                                        <FileText size={12} /> Mevcut PDF
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={!deviceForm.name.trim() || saving}>
                            <Plus size={16} className="mr-2" />
                            {saving ? 'Kaydediliyor...' : (editingDevice ? 'Güncelle' : 'Cihaz Ekle')}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        <DialogDescription>
                            Cihazlar için yeni bir kategori oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori Adı</label>
                            <Input
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="Örn: Mikroskoplar, Santrifüjler, Teraziler..."
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <FolderPlus size={16} className="mr-2" /> Kategori Oluştur
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
