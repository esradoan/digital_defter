import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash, Box, Thermometer, Package, Layers, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import cabinetService from '../services/cabinetService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

export default function CabinetDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cabinet, setCabinet] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openCategoryId, setOpenCategoryId] = useState(null);

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [productForm, setProductForm] = useState({
        name: '',
        catalogNumber: '',
        quantity: ''
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [cabinetData, categoriesData] = await Promise.all([
                cabinetService.getById(id),
                categoryService.getAll()
            ]);
            setCabinet(cabinetData);
            setCategories(categoriesData);

            const allProducts = await productService.getAll();
            const cabinetProducts = allProducts.filter(p => p.storageLocationId === parseInt(id));
            setProducts(cabinetProducts);
        } catch (err) {
            console.error(err);
            alert('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getProductsByCategory = (categoryId) => products.filter(p => p.categoryId === categoryId);
    const uncategorizedProducts = products.filter(p => !p.categoryId);

    const toggleCategory = (categoryId) => {
        setOpenCategoryId(prev => prev === categoryId ? null : categoryId);
    };

    const resetForm = () => {
        setProductForm({ name: '', catalogNumber: '', quantity: '' });
        setEditingProductId(null);
        setActiveCategoryId(null);
    };

    const openAddModal = (categoryId) => {
        resetForm();
        setActiveCategoryId(categoryId);
        setIsProductModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProductId(product.id);
        setActiveCategoryId(product.categoryId);
        setProductForm({
            name: product.name || '',
            catalogNumber: product.catalogNumber || '',
            quantity: product.quantity !== undefined ? String(product.quantity) : ''
        });
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: productForm.name || null,
                categoryId: activeCategoryId || null,
                catalogNumber: productForm.catalogNumber || null,
                quantity: productForm.quantity ? parseFloat(productForm.quantity) : 0,
                storageLocationId: parseInt(id)
            };

            if (editingProductId) {
                await productService.update(editingProductId, { id: editingProductId, ...payload });
            } else {
                await productService.create(payload);
            }

            setIsProductModalOpen(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Ürün kaydetme hatası:', err.response?.data || err);
            alert('Ürün kaydedilirken hata oluştu: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`"${productName || 'Bu ürün'}" silinecek. Emin misiniz?`)) return;
        try {
            await productService.delete(productId);
            fetchData();
        } catch (err) {
            console.error('Ürün silme hatası:', err.response?.data || err);
            alert('Ürün silinirken hata oluştu: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteCabinet = async () => {
        try {
            await cabinetService.delete(id);
            navigate('/cabinets');
        } catch (err) {
            console.error('Dolap silme hatası:', err);
            alert('Dolap silinirken bir hata oluştu.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await categoryService.create({ name: newCategoryName.trim() });
            setNewCategoryName('');
            setIsCategoryModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kategori ekleme hatası:', err);
            alert('Kategori eklenirken hata oluştu.');
        }
    };

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;
    if (!cabinet) return <div className="p-8 text-muted-foreground">Dolap bulunamadı.</div>;

    const categoryColors = [
        { bg: 'bg-sky-500/10', border: 'border-sky-500/30', text: 'text-sky-400', icon: 'text-sky-400' },
        { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', icon: 'text-violet-400' },
        { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'text-emerald-400' },
        { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400' },
        { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: 'text-rose-400' },
        { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', icon: 'text-teal-400' },
    ];

    const getColor = (i) => categoryColors[i % categoryColors.length];

    const activeCategoryName = activeCategoryId
        ? categories.find(c => c.id === activeCategoryId)?.name || 'Kategori'
        : 'Kategorisiz';

    // Product table per category
    const ProductTable = ({ items }) => (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="text-muted-foreground font-semibold">Ürün Adı</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Katalog No</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-center">Miktar</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-center w-[100px]">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/10">
                            <TableCell className="font-medium text-foreground">{product.name || '-'}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{product.catalogNumber || '-'}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-semibold">
                                    {product.quantity}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                                        onClick={() => openEditModal(product)}
                                        title="Düzenle"
                                    >
                                        <Edit size={15} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                        onClick={() => handleDelete(product.id, product.name)}
                                        title="Sil"
                                    >
                                        <Trash size={15} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/cabinets')}
                    className="h-10 w-10"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                        {cabinet.name}
                    </h1>
                    <div className="flex gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1.5"><Thermometer size={15} /> {cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                        <span className="flex items-center gap-1.5"><Box size={15} /> {cabinet.capacityInfo || 'Kapasite Yok'}</span>
                        <span className="flex items-center gap-1.5"><Package size={15} /> {products.length} ürün</span>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-3 mb-5">
                <Layers size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground m-0">Kategori Bölmeleri</h2>
                <span className="text-sm text-muted-foreground flex-1">— Bir bölmeye tıklayarak içindeki ürünleri görüntüleyin</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="gap-1.5"
                >
                    <FolderPlus size={15} /> Kategori Ekle
                </Button>
            </div>

            {/* Category Compartments */}
            <div className="flex flex-col gap-2.5">
                {categories.map((category, index) => {
                    const color = getColor(index);
                    const categoryProducts = getProductsByCategory(category.id);
                    const isOpen = openCategoryId === category.id;

                    return (
                        <Collapsible
                            key={category.id}
                            open={isOpen}
                            onOpenChange={() => toggleCategory(category.id)}
                        >
                            <Card className={`transition-all duration-300 overflow-hidden ${isOpen ? `${color.border} ${color.bg}` : 'hover:border-primary/20'}`}>
                                <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between p-4 px-5 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            {isOpen
                                                ? <ChevronDown size={18} className={color.icon} />
                                                : <ChevronRight size={18} className="text-muted-foreground" />
                                            }
                                            <Package size={18} className={isOpen ? color.icon : 'text-muted-foreground'} />
                                            <span className={`font-semibold text-base ${isOpen ? color.text : 'text-foreground'}`}>
                                                {category.name}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className={isOpen ? `${color.text} ${color.border}` : 'text-muted-foreground'}>
                                            {categoryProducts.length} ürün
                                        </Badge>
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="px-5 pb-5">
                                        <Separator className="mb-4" />
                                        <div className="flex justify-end mb-4">
                                            <Button
                                                size="sm"
                                                onClick={() => openAddModal(category.id)}
                                                className="gap-1.5 shadow-sm"
                                            >
                                                <Plus size={15} /> Yeni Ürün Ekle
                                            </Button>
                                        </div>

                                        {categoryProducts.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Box size={36} className="mx-auto mb-2 opacity-40" />
                                                <p className="text-sm m-0">Bu bölmede henüz ürün yok.</p>
                                            </div>
                                        ) : (
                                            <ProductTable items={categoryProducts} />
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    );
                })}

                {/* Uncategorized */}
                {uncategorizedProducts.length > 0 && (
                    <Collapsible
                        open={openCategoryId === 'uncategorized'}
                        onOpenChange={() => toggleCategory('uncategorized')}
                    >
                        <Card className={`transition-all duration-300 ${openCategoryId === 'uncategorized' ? 'border-slate-500/30 bg-slate-500/5' : 'hover:border-primary/20'}`}>
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-4 px-5 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === 'uncategorized'
                                            ? <ChevronDown size={18} className="text-slate-400" />
                                            : <ChevronRight size={18} className="text-muted-foreground" />
                                        }
                                        <Package size={18} className="text-muted-foreground" />
                                        <span className="font-semibold text-base text-foreground">Kategorisiz</span>
                                    </div>
                                    <Badge variant="outline" className="text-muted-foreground">
                                        {uncategorizedProducts.length} ürün
                                    </Badge>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="px-5 pb-5">
                                    <Separator className="mb-4" />
                                    <ProductTable items={uncategorizedProducts} />
                                </div>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>
                )}
            </div>

            {/* Delete Cabinet */}
            <div className="mt-12 mb-8 flex justify-end">
                <Button
                    variant="outline"
                    className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive gap-2"
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    <Trash size={16} />
                    Dolabı Sil
                </Button>
            </div>

            {/* Add/Edit Product Dialog */}
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProductId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                        </DialogTitle>
                        <DialogDescription>
                            Bölme: <span className="text-primary font-medium">{activeCategoryName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Ürün Adı</label>
                            <Input
                                value={productForm.name}
                                onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="Ürün adı"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Katalog No</label>
                                <Input
                                    value={productForm.catalogNumber}
                                    onChange={e => setProductForm({ ...productForm, catalogNumber: e.target.value })}
                                    placeholder="Katalog numarası"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Miktar</label>
                                <Input
                                    value={productForm.quantity}
                                    onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                                    placeholder="Miktar"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-1">
                            {editingProductId ? 'Güncelle' : 'Kaydet'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border text-center">
                    <div className="flex flex-col items-center pt-4">
                        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
                            <Trash className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-center">Emin misin?</DialogTitle>
                            <DialogDescription className="text-center leading-relaxed">
                                Bu dolabı ve içerisindeki her şeyi silmek üzeresin. Bu işlem geri alınamaz.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3 w-full mt-6">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Hayır
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleDeleteCabinet}
                            >
                                Evet
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Category Dialog */}
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        <DialogDescription>
                            Dolap bölmeleri için yeni bir kategori oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori Adı</label>
                            <Input
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="Örn: Diğer, Enzimler, Primerler..."
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
