import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash, Box, Thermometer } from 'lucide-react';
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

    // Form Data
    const [productForm, setProductForm] = useState({
        name: '',
        categoryId: '',
        serialNumber: '',
        quantity: 0,
        unit: 'Adet'
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

            // Dolaptaki ürünleri getir (Normalde bunu backend'de filter endpoint ile yaparız, şimdilik tümünü çekip filtreliyoruz veya cabinetData içinde geliyorsa onu kullanırız)
            // Şimdilik Cabinet entity'sinde Products listesi var mı kontrol edelim -> Evet var ama detaylı filtreleme gerekebilir.
            // Düz mantık: Tüm ürünleri çekip filter. (Performans için ileride optimize edilir)
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

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: productForm.name || null,
                categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
                serialNumber: productForm.serialNumber || null,
                quantity: Number(productForm.quantity) || 0,
                unit: productForm.unit || null,
                storageLocationId: parseInt(id)
            };

            console.log('Gönderilen veri:', payload);

            await productService.create(payload);

            setIsProductModalOpen(false);
            setProductForm({ name: '', categoryId: '', serialNumber: '', quantity: 0, unit: 'Adet' });
            fetchData(); // Listeyi yenile
        } catch (err) {
            console.error('Ürün ekleme hatası:', err.response?.data || err);
            alert('Ürün eklenirken hata oluştu: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;
    if (!cabinet) return <div className="p-8">Dolap bulunamadı.</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/cabinets')} className="p-2 hover:bg-slate-700 rounded-lg">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold m-0 flex items-center gap-3">
                        {cabinet.name}
                        <span className="text-sm font-normal bg-slate-700 px-3 py-1 rounded">
                            {cabinet.type === 0 ? 'Buzdolabı' : cabinet.type === 1 ? 'Derin Dondurucu' : 'Oda'}
                        </span>
                    </h1>
                    <div className="flex gap-4 text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Thermometer size={16} /> {cabinet.temperatureCondition}</span>
                        <span className="flex items-center gap-1"><Box size={16} /> {cabinet.capacityInfo}</span>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold m-0">Ürünler</h2>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} /> Ürün Ekle
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <Box size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Bu dolapta henüz ürün yok.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700">
                                <th className="p-3">Ürün Adı</th>
                                <th className="p-3">Kategori</th>
                                <th className="p-3">Seri No</th>
                                <th className="p-3">Miktar</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-3 font-medium">{product.name || '-'}</td>
                                    <td className="p-3">{product.categoryName || '-'}</td>
                                    <td className="p-3 font-mono text-sm text-slate-300">{product.serialNumber || '-'}</td>
                                    <td className="p-3">
                                        <span className="bg-slate-900 px-2 py-1 rounded text-sm">
                                            {product.quantity} {product.unit}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button className="text-slate-400 hover:text-red-400">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold m-0">Yeni Ürün Ekle</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Ürün Adı</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 outline-none"
                                    placeholder="Ürün adı giriniz"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Kategori</label>
                                    <select
                                        value={productForm.categoryId}
                                        onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 outline-none"
                                    >
                                        <option value="">Seçiniz...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Seri No</label>
                                    <input
                                        type="text"
                                        value={productForm.serialNumber}
                                        onChange={e => setProductForm({ ...productForm, serialNumber: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 outline-none"
                                        placeholder="Seri no"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Miktar</label>
                                    <input
                                        type="number"
                                        value={productForm.quantity}
                                        onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Birim</label>
                                    <input
                                        type="text"
                                        value={productForm.unit}
                                        onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors">
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
