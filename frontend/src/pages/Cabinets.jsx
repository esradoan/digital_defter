import { useState, useEffect } from 'react';
import { Thermometer, Box, Archive, X, Save, Edit as EditIcon, Plus } from 'lucide-react';
import cabinetService from '../services/cabinetService';
import { Link } from 'react-router-dom';

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

    if (loading) return <div className="p-4 text-muted">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold m-0 text-main">Dolaplar</h1>
                <button
                    onClick={handleCreateClick}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                    <Plus size={20} /> Yeni Dolap
                </button>
            </div>

            {/* Empty State */}
            {cabinets.length === 0 ? (
                <div className="p-10 text-center text-muted bg-card rounded-xl">
                    <Archive size={48} className="mb-4 opacity-50 mx-auto" />
                    <p>Henüz hiç dolap eklenmemiş.</p>
                </div>
            ) : (
                /* Cabinet Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cabinets.map((cabinet) => (
                        <div
                            key={cabinet.id}
                            className="bg-card rounded-xl p-5 border border-border-custom relative transition-colors duration-300 hover:border-primary/30"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Link to={`/cabinets/${cabinet.id}`} className="flex-1">
                                    <h3 className="m-0 text-lg font-semibold cursor-pointer flex items-center gap-2 text-main hover:text-primary transition-colors">
                                        {cabinet.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-sm px-2 py-1 bg-border-custom text-main rounded-md font-medium">
                                        {cabinet.type === 0 ? 'Buzdolabı' : cabinet.type === 1 ? 'Derin Dondurucu' : 'Oda'}
                                    </span>
                                    <button
                                        onClick={(e) => handleEditClick(e, cabinet)}
                                        className="text-muted p-1 hover:text-primary transition-colors"
                                        title="Düzenle"
                                    >
                                        <EditIcon size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 text-muted text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Thermometer size={16} />
                                    <span>{cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Box size={16} />
                                    <span>{cabinet.capacityInfo || 'Kapasite Yok'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
                    <div className="bg-card p-6 rounded-xl w-full max-w-lg border border-border-custom shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="m-0 text-2xl font-bold text-main">
                                {editingId ? 'Dolabı Düzenle' : 'Yeni Dolap Ekle'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-border-custom transition-colors">
                                <X size={24} className="text-muted" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-2 text-muted text-sm">Dolap Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 rounded-lg bg-dark border border-border-custom text-main outline-none focus:border-primary transition-colors"
                                    placeholder="Örn: Ana Laboratuvar Buzdolabı"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-muted text-sm">Tip</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
                                    className="w-full p-3 rounded-lg bg-dark border border-border-custom text-main outline-none focus:border-primary transition-colors"
                                >
                                    <option value={0}>Buzdolabı (+4°C)</option>
                                    <option value={1}>Derin Dondurucu (-20°C / -80°C)</option>
                                    <option value={2}>Oda / Raf (Normal Sıcaklık)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-muted text-sm">Sıcaklık</label>
                                    <input
                                        type="text"
                                        value={formData.temperatureCondition}
                                        onChange={(e) => setFormData({ ...formData, temperatureCondition: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-dark border border-border-custom text-main outline-none focus:border-primary transition-colors"
                                        placeholder="+4°C"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-muted text-sm">Kapasite Bilgisi</label>
                                    <input
                                        type="text"
                                        value={formData.capacityInfo}
                                        onChange={(e) => setFormData({ ...formData, capacityInfo: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-dark border border-border-custom text-main outline-none focus:border-primary transition-colors"
                                        placeholder="5 Raf / 200 Kutu"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-2.5 p-3.5 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
                            >
                                <Save size={20} />
                                {editingId ? 'Güncelle' : 'Kaydet'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
