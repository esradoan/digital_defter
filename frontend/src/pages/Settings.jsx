import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Palette, Download, Shield, Save, CheckCircle2, AlertCircle, Moon, Sun, Monitor, Package, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { getAssetUrl } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Settings() {
    const { user, login } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile State
    const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
    // Password State
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const [uploadingImage, setUploadingImage] = useState(false);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateProfile(profileForm.fullName, profileForm.email);
            // Güncel bilgileri context'e (localStorage) yansıtmak için:
            const updatedUser = { ...user, fullName: profileForm.fullName, email: profileForm.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            showMessage('success', 'Profil başarıyla güncellendi.');
            // (Sayfa yenilendiğinde App.jsx'teki context de bu veriyi çekecek, ya da AuthContext update fonksiyonu da eklenebilir)
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Profil güncellenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showMessage('error', 'Yeni şifreler eşleşmiyor!');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            showMessage('success', 'Şifreniz başarıyla değiştirildi.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Şifre değiştirilemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const imageUrl = await authService.uploadProfilePicture(file);
            const updatedUser = { ...user, profileImageUrl: imageUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Reload to apply context update globally
            window.location.reload();
        } catch (error) {
            showMessage('error', 'Fotoğraf yüklenirken bir hata oluştu');
        } finally {
            setUploadingImage(false);
        }
    };

    // Tabs Configuration
    const tabs = [
        { id: 'profile', icon: User, label: 'Profil Ayarları' },
        { id: 'appearance', icon: Palette, label: 'Görünüm' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
                    <SettingsIcon className="text-primary" size={28} /> Ayarlar
                </h1>
                <p className="text-muted-foreground mt-1">Sistem tercihlerinizi ve hesabınızı yapılandırın.</p>
            </div>

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Genel Bilgiler</CardTitle>
                                    <CardDescription>Adınızı ve iletişim e-postanızı güncelleyin.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col items-center justify-center space-y-4 pb-6 border-b border-border">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                                {user?.profileImageUrl ? (
                                                    <img src={getAssetUrl(user.profileImageUrl)} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={40} className="text-primary/50" />
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium">
                                                    {uploadingImage ? 'Yükleniyor...' : 'Değiştir'}
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Profil Fotoğrafı</p>
                                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG veya WebP. Maks 5MB.</p>
                                        </div>
                                    </div>

                                    <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Ad Soyad</label>
                                            <Input
                                                value={profileForm.fullName}
                                                onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">E-posta</label>
                                            <Input
                                                type="email"
                                                value={profileForm.email}
                                                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="border-t border-border pt-4">
                                    <Button type="submit" form="profile-form" disabled={loading} className="gap-2">
                                        <Save size={16} /> Değişiklikleri Kaydet
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Şifre Değiştir</CardTitle>
                                    <CardDescription>Hesabınızın güvenliği için güçlü bir şifre kullanın.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form id="password-form" onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Mevcut Şifre</label>
                                            <Input
                                                type="password"
                                                value={passwordForm.currentPassword}
                                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Yeni Şifre</label>
                                                <Input
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                    required minLength={6}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Yeni Şifre (Tekrar)</label>
                                                <Input
                                                    type="password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                    required minLength={6}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="border-t border-border pt-4">
                                    <Button type="submit" form="password-form" disabled={loading} variant="outline" className="gap-2">
                                        <Save size={16} /> Şifreyi Güncelle
                                    </Button>
                                </CardFooter>
                            </Card>
                        </>
                    )}

                    {/* APPEARANCE TAB */}
                    {activeTab === 'appearance' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tema Seçimi</CardTitle>
                                <CardDescription>Laboratuvar defterinizin arayüz temasını kişiselleştirin.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Light Theme */}
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <Sun className="text-slate-800" />
                                        </div>
                                        <span className="font-medium text-foreground">Aydınlık Mod</span>
                                    </button>

                                    {/* Dark Theme */}
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                            <Moon className="text-slate-200" />
                                        </div>
                                        <span className="font-medium text-foreground">Karanlık Mod</span>
                                    </button>

                                    {/* Lilac Theme */}
                                    <button
                                        onClick={() => setTheme('lilac')}
                                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${theme === 'lilac' ? 'border-[#8b5cf6] bg-[#8b5cf6]/10' : 'border-border hover:border-[#8b5cf6]/50'}`}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-[#f3e8ff] flex items-center justify-center mb-4">
                                            <Palette className="text-[#8b5cf6]" />
                                        </div>
                                        <span className="font-medium text-foreground">Lila Mod <Badge variant="secondary" className="ml-1 text-[10px]">YENİ</Badge></span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* EXPORT TAB */}
                    {activeTab === 'export' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Veri Dışa Aktarımı</CardTitle>
                                <CardDescription>Dijital Lab Defterinizdeki tüm notlarınızı arşivlemek için Excel veya CSV formatlarında indirebilirsiniz.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-6 border border-border rounded-xl bg-card flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-medium text-lg">Lab Notları (CSV)</h3>
                                        <p className="text-sm text-muted-foreground w-3/4">Tarih, saat, içerik, protokol ve ilişkili cihaz bilgilerini içeren virgülle ayrılmış veri dosyası. Excel ile açılabilir.</p>
                                    </div>
                                    <Button onClick={handleExportCsv} className="shrink-0 gap-2 bg-emerald-600 hover:bg-emerald-700">
                                        <Download size={18} /> İndir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ADMIN SYSTEM MANAGEMENT TAB */}
                    {activeTab === 'admin' && user?.role === 'Admin' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kategori Yönetimi</CardTitle>
                                    <CardDescription>Sistemdeki tüm cihaz ve depo/ürün kategorilerini buradan merkezi olarak yönetebilirsiniz.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-6 flex flex-col gap-4 rounded-lg bg-muted/30 p-4 sm:items-end">
                                        <div className="space-y-2">
                                            <Label>Kategori Türü</Label>
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px]"
                                                value={newCat.type}
                                                onChange={e => setNewCat({ ...newCat, type: e.target.value })}
                                            >
                                                <option value="device">Cihaz Kategorisi</option>
                                                <option value="warehouse">Depo/Ürün Kategorisi</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <Label>Kategori Adı</Label>
                                            <Input
                                                placeholder="Örn: Analitik Terazi"
                                                value={newCat.name}
                                                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <Label>Açıklama (Opsiyonel)</Label>
                                            <Input
                                                placeholder="İsteğe bağlı açıklama..."
                                                value={newCat.description}
                                                onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                                            />
                                        </div>
                                        <Button onClick={handleCreateCategory} disabled={loading || !newCat.name} className="w-full gap-2 sm:w-auto">
                                            <Plus size={16} /> Ekle
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Device Categories */}
                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <div className="bg-muted py-2 px-4 font-semibold flex items-center gap-2 border-b border-border">
                                                <Monitor size={16} className="text-primary" /> Cihaz Kategorileri
                                            </div>
                                            <Table>
                                                <TableBody>
                                                    {deviceCategories.map(cat => (
                                                        <TableRow key={cat.id}>
                                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 h-8 px-2" onClick={() => handleDeleteCategory('device', cat.id)}>
                                                                    Sil
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {deviceCategories.length === 0 && (
                                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">Kategori yok</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Warehouse Categories */}
                                        <div className="border border-border rounded-lg overflow-hidden">
                                            <div className="bg-muted py-2 px-4 font-semibold flex items-center gap-2 border-b border-border">
                                                <Package size={16} className="text-primary" /> Depo Ürün Kategorileri
                                            </div>
                                            <Table>
                                                <TableBody>
                                                    {warehouseCategories.map(cat => (
                                                        <TableRow key={cat.id}>
                                                            <TableCell className="font-medium">{cat.name}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 h-8 px-2" onClick={() => handleDeleteCategory('warehouse', cat.id)}>
                                                                    Sil
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {warehouseCategories.length === 0 && (
                                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">Kategori yok</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
