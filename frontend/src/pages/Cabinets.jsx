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
    const [editingId, setEditingId] = useState(null); // Düzenlenen dolap ID'si
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
        e.preventDefault(); // Link tıklamasını engelle
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
                // Güncelleme Modu
                await cabinetService.update(editingId, formData);
            } else {
                // Ekleme Modu
                await cabinetService.create(formData);
            }
            await fetchCabinets(); // Listeyi güncelle
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert('İşlem sırasında bir hata oluştu!');
        }
    };

    if (loading) return <div className="p-4">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Dolaplar</h1>
                <button
                    onClick={handleCreateClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={20} /> Yeni Dolap
                </button>
            </div>

            {cabinets.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '10px' }}>
                    <Archive size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Henüz hiç dolap eklenmemiş.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {cabinets.map((cabinet) => (
                        <div key={cabinet.id} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <Link to={`/cabinets/${cabinet.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {cabinet.name}
                                    </h3>
                                </Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.875rem', padding: '4px 8px', backgroundColor: '#334155', borderRadius: '4px' }}>
                                        {cabinet.type === 0 ? 'Buzdolabı' : cabinet.type === 1 ? 'Derin Dondurucu' : 'Oda'}
                                    </span>
                                    <button
                                        onClick={(e) => handleEditClick(e, cabinet)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                                        title="Düzenle"
                                    >
                                        <EditIcon size={18} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Thermometer size={16} />
                                    <span>{cabinet.temperatureCondition || 'Belirtilmedi'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px',
                        border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                                {editingId ? 'Dolabı Düzenle' : 'Yeni Dolap Ekle'}
                            </h2>
                            <button onClick={handleCloseModal} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'transparent' }}>
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Dolap Adı</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}
                                    placeholder="Örn: Ana Laboratuvar Buzdolabı"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Tip</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}
                                >
                                    <option value={0}>Buzdolabı (+4°C)</option>
                                    <option value={1}>Derin Dondurucu (-20°C / -80°C)</option>
                                    <option value={2}>Oda / Raf (Normal Sıcaklık)</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Sıcaklık</label>
                                    <input
                                        type="text"
                                        value={formData.temperatureCondition}
                                        onChange={(e) => setFormData({ ...formData, temperatureCondition: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}
                                        placeholder="+4°C"
                                    />
                                </div>
                                <div style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Kapasite Bilgisi</label>
                                    <input
                                        type="text"
                                        value={formData.capacityInfo}
                                        onChange={(e) => setFormData({ ...formData, capacityInfo: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}
                                        placeholder="5 Raf / 200 Kutu"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '10px', padding: '14px', backgroundColor: 'var(--primary)', color: 'white',
                                    borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    cursor: 'pointer', border: 'none'
                                }}
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
