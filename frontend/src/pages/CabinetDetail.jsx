import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash, Box, Thermometer, X } from 'lucide-react';
import cabinetService from '../services/cabinetService';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

export default function CabinetDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cabinet, setCabinet] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    // Form Data
    const [productForm, setProductForm] = useState({
        name: '',
        categoryId: '',
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

    const resetForm = () => {
        setProductForm({ name: '', categoryId: '', catalogNumber: '', quantity: '' });
        setEditingProductId(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsProductModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProductId(product.id);
        setProductForm({
            name: product.name || '',
            categoryId: product.categoryId ? String(product.categoryId) : '',
            catalogNumber: product.catalogNumber || '',
            quantity: product.quantity !== undefined ? String(product.quantity) : ''
        });
        setIsProductModalOpen(true);
    };

    const closeModal = () => {
        setIsProductModalOpen(false);
        resetForm();
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: productForm.name || null,
                categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
                catalogNumber: productForm.catalogNumber || null,
                quantity: productForm.quantity ? parseFloat(productForm.quantity) : 0,
                storageLocationId: parseInt(id)
            };

            if (editingProductId) {
                await productService.update(editingProductId, { id: editingProductId, ...payload });
            } else {
                await productService.create(payload);
            }

            closeModal();
            fetchData();
        } catch (err) {
            console.error('Ürün kaydetme hatası:', err.response?.data || err);
            alert('Ürün kaydedilirken hata oluştu: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`"${productName || 'Bu ürün'}" silinecek. Emin misiniz?`)) {
            return;
        }

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

    if (loading) return <div className="p-8 text-muted">Yükleniyor...</div>;
    if (!cabinet) return <div className="p-8 text-muted">Dolap bulunamadı.</div>;

    const inputClasses = "w-full p-3 rounded-lg bg-dark border border-border-custom text-main outline-none focus:border-primary transition-colors";
    const labelClasses = "block text-sm text-muted mb-1.5";

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/cabinets')}
                    className="p-2 rounded-lg border border-border-custom text-main flex items-center justify-center hover:bg-card transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold m-0 mb-2 flex items-center text-main">
                        {cabinet.name}
                    </h1>
                    <div className="flex gap-4 text-muted text-sm">
                        <span className="flex items-center gap-1"><Thermometer size={16} /> {cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                        <span className="flex items-center gap-1"><Box size={16} /> {cabinet.capacityInfo || 'Kapasite Yok'}</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-xl border border-border-custom p-8 shadow-lg transition-colors duration-300">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-custom">
                    <div>
                        <h2 className="text-2xl font-bold m-0 mb-2 text-main">Ürünler</h2>
                        <p className="text-muted text-sm m-0">Bu dolaptaki tüm ürünleri buradan yönetebilirsiniz.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        <Plus size={20} /> Yeni Ürün Ekle
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-10 text-muted">
                        <Box size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="m-0">Bu dolapta henüz ürün yok.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03]">
                                    <th className="px-4 py-3 border-b border-border-custom font-semibold text-muted">Ürün Adı</th>
                                    <th className="px-4 py-3 border-b border-border-custom font-semibold text-muted">Kategori</th>
                                    <th className="px-4 py-3 border-b border-border-custom font-semibold text-muted">Katalog No</th>
                                    <th className="px-4 py-3 border-b border-border-custom font-semibold text-muted text-center">Miktar</th>
                                    <th className="px-4 py-3 border-b border-border-custom font-semibold text-muted text-center w-[120px]">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-border-custom hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-main">{product.name || '-'}</td>
                                        <td className="px-4 py-3 text-muted">{product.categoryName || '-'}</td>
                                        <td className="px-4 py-3 font-mono text-sm text-muted">{product.catalogNumber || '-'}</td>
                                        <td className="px-4 py-3 text-center text-main">{product.quantity}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="text-sky-400 p-1.5 rounded-md hover:bg-sky-400/10 transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="text-red-400 p-1.5 rounded-md hover:bg-red-400/10 transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Cabinet Section */}
            <div className="mt-12 mb-8 flex justify-end">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 bg-transparent text-red-500 border border-red-500 px-5 py-2.5 rounded-lg font-medium hover:bg-red-500/10 transition-colors"
                >
                    <Trash size={18} />
                    Dolabı Sil
                </button>
            </div>

            {/* Add/Edit Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl w-full max-w-lg border border-border-custom shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-border-custom flex justify-between items-center">
                            <h3 className="text-xl font-bold m-0 text-main">
                                {editingProductId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h3>
                            <button onClick={closeModal} className="text-muted hover:text-main transition-colors flex items-center justify-center p-1">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleProductSubmit} className="p-6 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Ürün Adı</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Ürün adı"
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Kategori</label>
                                    <select
                                        value={productForm.categoryId}
                                        onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                                        className={inputClasses}
                                    >
                                        <option value="">Seçiniz...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Katalog No</label>
                                    <input
                                        type="text"
                                        value={productForm.catalogNumber}
                                        onChange={e => setProductForm({ ...productForm, catalogNumber: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Katalog numarası"
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Miktar</label>
                                    <input
                                        type="text"
                                        value={productForm.quantity}
                                        onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Miktar"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-primary text-white font-bold p-3.5 rounded-lg hover:bg-primary-dark transition-colors">
                                    {editingProductId ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Cabinet Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl w-full max-w-sm border border-border-custom py-8 px-6 text-center">
                        <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10">
                            <Trash className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-main">
                            Emin misin?
                        </h3>
                        <p className="text-muted mb-8 leading-relaxed">
                            Bu dolabı ve içerisindeki her şeyi silmek üzeresin. Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 px-6 rounded-lg bg-dark text-main font-medium border border-border-custom hover:bg-card transition-colors"
                            >
                                Hayır
                            </button>
                            <button
                                onClick={handleDeleteCabinet}
                                className="flex-1 py-3 px-6 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                            >
                                Evet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
