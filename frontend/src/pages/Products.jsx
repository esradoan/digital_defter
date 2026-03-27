import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Plus, Edit as EditIcon, Trash, Search, MapPin } from 'lucide-react';
import productService from '../services/productService';
import cabinetService from '../services/cabinetService';
import categoryService from '../services/categoryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Products() {
    const [searchParams] = useSearchParams();
    const defaultCabinetId = searchParams.get('cabinetId');

    const [products, setProducts] = useState([]);
    const [cabinets, setCabinets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        categoryId: 'none',
        storageLocationId: defaultCabinetId || 'none',
        catalogNumber: '',
        quantity: '',
        unit: ''
    });

    useEffect(() => {
        fetchData();
        if (defaultCabinetId) {
            setIsModalOpen(true);
        }
    }, [defaultCabinetId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsData, cabinetsData, categoriesData] = await Promise.all([
                productService.getAll(),
                cabinetService.getAll(),
                categoryService.getAll()
            ]);
            setProducts(productsData);
            setCabinets(cabinetsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Veri yükleme hatası', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            categoryId: 'none',
            storageLocationId: 'none',
            catalogNumber: '',
            quantity: '',
            unit: ''
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            categoryId: product.categoryId ? String(product.categoryId) : 'none',
            storageLocationId: product.storageLocationId ? String(product.storageLocationId) : 'none',
            catalogNumber: product.catalogNumber || '',
            quantity: product.quantity !== undefined ? String(product.quantity) : '',
            unit: product.unit || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name || null,
                categoryId: formData.categoryId === 'none' ? null : parseInt(formData.categoryId),
                storageLocationId: formData.storageLocationId === 'none' ? null : parseInt(formData.storageLocationId),
                catalogNumber: formData.catalogNumber || null,
                quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
                unit: formData.unit || null
            };

            if (editingProduct) {
                await productService.update(editingProduct.id, { id: editingProduct.id, ...payload });
            } else {
                await productService.create(payload);
            }

            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kaydetme hatası:', err);
            alert('Ürün kaydedilirken hata oluştu.');
        }
    };

    const confirmDelete = async () => {
        if (!deletingProductId) return;
        try {
            await productService.delete(deletingProductId);
            setIsDeleteModalOpen(false);
            setDeletingProductId(null);
            fetchData();
        } catch (err) {
            console.error('Silme hatası', err);
            alert('Ürün silinirken hata oluştu.');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.catalogNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.storageLocationName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-4 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Ürünler</h1>
                    <p className="text-muted-foreground mt-1">Materyal ve envanter (Master Data) yönetim merkezi.</p>
                </div>
                <Button onClick={handleCreateClick} className="w-full gap-2 shadow-md shadow-primary/20 sm:w-auto">
                    <Plus size={20} /> Yeni Ürün Ekle
                </Button>
            </div>

            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Ürün adı, katalog veya dolap ara..."
                    className="pl-10"
                />
            </div>

            <Card className="border-border">
                <CardContent className="p-0">
                    <Table className="min-w-[760px]">
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="text-muted-foreground font-semibold">Ürün Adı</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Kategori</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Katalog No</TableHead>
                                <TableHead className="text-muted-foreground font-semibold">Lokasyon / Dolap</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-center">Miktar</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-center">Adet</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-center w-[120px]">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <Package size={32} className="mx-auto mb-3 opacity-30" />
                                        Mevcut herhangi bir ürün bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-muted/10">
                                        <TableCell className="font-medium text-foreground">{product.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {product.categoryName || 'Kategorisiz'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-muted-foreground">{product.catalogNumber || '-'}</TableCell>
                                        <TableCell>
                                            {product.storageLocationName ? (
                                                <span className="flex items-center gap-1.5 text-sm text-primary font-medium">
                                                    <MapPin size={14} /> {product.storageLocationName}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                    Atanmadı
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-semibold">
                                                {product.quantity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground text-sm">
                                            {product.unit || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                                                    onClick={() => handleEditClick(product)}
                                                    title="Düzenle"
                                                >
                                                    <EditIcon size={15} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    onClick={() => {
                                                        setDeletingProductId(product.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    title="Sil"
                                                >
                                                    <Trash size={15} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Product Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
                        <DialogDescription>
                            Ürün detaylarını girin ve hangi dolaba kaydedileceğini seçin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Ürün Adı *</label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ürün adı"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori</label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={val => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Kategorisiz</SelectItem>
                                    {categories.map(c => (
                                        <SelectItem key={`cat-${c.id}`} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Hangi Dolaba Eklenecek? (Lokasyon) *</label>
                            <Select
                                value={formData.storageLocationId}
                                onValueChange={val => setFormData({ ...formData, storageLocationId: val })}
                            >
                                <SelectTrigger className="border-primary/30">
                                    <SelectValue placeholder="Dolap Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        <span className="italic text-muted-foreground inline-flex items-center gap-2">
                                            - Henüz Atanmadı -
                                        </span>
                                    </SelectItem>
                                    {cabinets.map(c => (
                                        <SelectItem key={`cab-${c.id}`} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Katalog No</label>
                                <Input
                                    value={formData.catalogNumber}
                                    onChange={e => setFormData({ ...formData, catalogNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Miktar</label>
                                <Input
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="Miktar"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Adet / Birim</label>
                            <Input
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="Örn: adet, kutu, ml, litre"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            {editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border text-center">
                    <div className="flex flex-col items-center pt-4">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
                            <Trash className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-center">Silmek istediğinize emin misiniz?</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-3 w-full mt-6">
                            <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
                                İptal
                            </Button>
                            <Button variant="destructive" className="flex-1" onClick={confirmDelete}>
                                Evet, Sil
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
