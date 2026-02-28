import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FlaskConical, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register } = useAuth();

    // Form states
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ fullName: '', username: '', email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(loginForm.username, loginForm.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcı adı veya şifre hatalı');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await register(registerForm.username, registerForm.email, registerForm.password, registerForm.fullName);
            setSuccess('Hesap oluşturuldu! Şimdi giriş yapabilirsiniz.');
            setIsLogin(true);
            setLoginForm({ username: registerForm.username, password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Kayıt sırasında hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <FlaskConical size={32} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">🧪 LabManager</h1>
                    <p className="text-muted-foreground mt-2">Laboratuvar Yönetim Sistemi</p>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-1 bg-muted/30 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${isLogin
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <LogIn size={16} /> Giriş Yap
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${!isLogin
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <UserPlus size={16} /> Kayıt Ol
                    </button>
                </div>

                <Card className="border-border">
                    <CardContent className="pt-6">
                        {/* Error/Success */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                {success}
                            </div>
                        )}

                        {isLogin ? (
                            /* LOGIN FORM */
                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Kullanıcı Adı</label>
                                    <Input
                                        value={loginForm.username}
                                        onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="kullaniciadi"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Şifre</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={loginForm.password}
                                            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-2" disabled={loading}>
                                    <LogIn size={16} className="mr-2" />
                                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                                </Button>
                            </form>
                        ) : (
                            /* REGISTER FORM */
                            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Ad Soyad</label>
                                    <Input
                                        value={registerForm.fullName}
                                        onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                                        placeholder="Esra Doğan"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Kullanıcı Adı</label>
                                    <Input
                                        value={registerForm.username}
                                        onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
                                        placeholder="esradogan"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">E-posta</label>
                                    <Input
                                        type="email"
                                        value={registerForm.email}
                                        onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                                        placeholder="esra@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Şifre</label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={registerForm.password}
                                            onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-2" disabled={loading}>
                                    <UserPlus size={16} className="mr-2" />
                                    {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    LabManager © 2025 — Laboratuvar Yönetim Sistemi
                </p>
            </div>
        </div>
    );
}
