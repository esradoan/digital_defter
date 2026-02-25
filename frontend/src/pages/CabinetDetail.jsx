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
    const [editingProductId, setEditingProductId] = useState(null); // null = yeni ürün, sayı = düzenleme

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
                // Güncelleme
                await productService.update(editingProductId, { id: editingProductId, ...payload });
            } else {
                // Yeni ekleme
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

    if (loading) return <div style={{ padding: '2rem' }}>Yükleniyor...</div>;
    if (!cabinet) return <div style={{ padding: '2rem' }}>Dolap bulunamadı.</div>;

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-dark)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        marginBottom: '6px'
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/cabinets')}
                    style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center' }}>
                        {cabinet.name}
                    </h1>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Thermometer size={16} /> {cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Box size={16} /> {cabinet.capacityInfo || 'Kapasite Yok'}</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)' }}>Ürünler</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Bu dolaptaki tüm ürünleri buradan yönetebilirsiniz.</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', border: 'none' }}
                    >
                        <Plus size={20} /> Yeni Ürün Ekle
                    </button>
                </div>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <Box size={48} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                        <p style={{ margin: 0 }}>Bu dolapta henüz ürün yok.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>Ürün Adı</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>Kategori</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)' }}>Katalog No</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>Miktar</th>
                                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center', width: '120px' }}>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{product.name || '-'}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{product.categoryName || '-'}</td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{product.catalogNumber || '-'}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-main)' }}>{product.quantity}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#38bdf8', padding: '6px', borderRadius: '6px' }}
                                                    title="Düzenle"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#f87171', padding: '6px', borderRadius: '6px' }}
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
            <div style={{ marginTop: '48px', marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                >
                    <Trash size={18} />
                    Dolabı Sil
                </button>
            </div>

            {/* Add/Edit Product Modal */}
            {isProductModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', width: '100%', maxWidth: '512px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>
                                {editingProductId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleProductSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Ürün Adı</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Ürün adı"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Kategori</label>
                                    <select
                                        value={productForm.categoryId}
                                        onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="">Seçiniz...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Katalog No</label>
                                    <input
                                        type="text"
                                        value={productForm.catalogNumber}
                                        onChange={e => setProductForm({ ...productForm, catalogNumber: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Katalog numarası"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Miktar</label>
                                    <input
                                        type="text"
                                        value={productForm.quantity}
                                        onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Miktar"
                                    />
                                </div>
                            </div>

                            <div style={{ paddingTop: '8px' }}>
                                <button type="submit" style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold', padding: '14px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>
                                    {editingProductId ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Cabinet Confirmation Modal */}
            {isDeleteModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', width: '100%', maxWidth: '384px', border: '1px solid var(--border-color)', padding: '32px 24px', textAlign: 'center' }}>
                        <div style={{ margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', width: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                            <Trash style={{ height: '32px', width: '32px', color: '#ef4444' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                            Emin misin?
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', margin: '0 0 32px 0', lineHeight: 1.5 }}>
                            Bu dolabı ve içerisindeki her şeyi silmek üzeresin. Bu işlem geri alınamaz.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', fontWeight: '500', border: '1px solid var(--border-color)', cursor: 'pointer', flex: 1 }}
                            >
                                Hayır
                            </button>
                            <button
                                onClick={handleDeleteCabinet}
                                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: '#ef4444', color: 'white', fontWeight: '500', border: 'none', cursor: 'pointer', flex: 1 }}
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
