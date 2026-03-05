import { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, Trash, CheckCircle, XCircle, Shield, Mail } from 'lucide-react';
import userService from '../services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', userId: null, userName: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (err) {
            console.error('Kullanıcılar yüklenemedi', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            await userService.approve(confirmDialog.userId);
            setConfirmDialog({ open: false, type: '', userId: null, userName: '' });
            fetchUsers();
        } catch (err) {
            console.error('Onaylama hatası', err);
        }
    };

    const handleDelete = async () => {
        try {
            await userService.delete(confirmDialog.userId);
            setConfirmDialog({ open: false, type: '', userId: null, userName: '' });
            fetchUsers();
        } catch (err) {
            console.error('Silme hatası', err);
        }
    };

    const pendingUsers = users.filter(u => !u.isApproved && u.role !== 'Admin');
    const approvedUsers = users.filter(u => u.isApproved);

    if (loading) return <div className="p-4 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Shield className="text-primary" size={28} /> Kullanıcı Yönetimi
                </h1>
                <p className="text-muted-foreground mt-1">Kayıtlı kullanıcıları yönetin ve yeni kayıtları onaylayın.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10"><Users className="text-primary" size={20} /></div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                                <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10"><UserCheck className="text-emerald-500" size={20} /></div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{approvedUsers.length}</p>
                                <p className="text-sm text-muted-foreground">Aktif Kullanıcı</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="text-amber-500" size={20} /></div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{pendingUsers.length}</p>
                                <p className="text-sm text-muted-foreground">Onay Bekleyen</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/30 p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`py-2 px-5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'pending'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Clock size={16} /> Onay Bekleyenler
                    {pendingUsers.length > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">{pendingUsers.length}</Badge>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`py-2 px-5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'approved'
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <UserCheck size={16} /> Aktif Kullanıcılar
                </button>
            </div>

            {/* Pending Users Table */}
            {activeTab === 'pending' && (
                <Card className="border-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="text-muted-foreground font-semibold">Ad Soyad</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">Kullanıcı Adı</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">E-posta</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">Kayıt Tarihi</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold text-center w-[180px]">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
                                            Onay bekleyen kullanıcı yok.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingUsers.map(user => (
                                        <TableRow key={user.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-foreground">{user.fullName}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.username}</TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Mail size={14} /> {user.email}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                                                        onClick={() => setConfirmDialog({ open: true, type: 'approve', userId: user.id, userName: user.fullName })}
                                                    >
                                                        <CheckCircle size={14} /> Onayla
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="gap-1.5"
                                                        onClick={() => setConfirmDialog({ open: true, type: 'delete', userId: user.id, userName: user.fullName })}
                                                    >
                                                        <XCircle size={14} /> Reddet
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
            )}

            {/* Approved Users Table */}
            {activeTab === 'approved' && (
                <Card className="border-border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="text-muted-foreground font-semibold">Ad Soyad</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">Kullanıcı Adı</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">E-posta</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">Rol</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold">Son Giriş</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold text-center w-[100px]">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            Aktif kullanıcı bulunamadı.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    approvedUsers.map(user => (
                                        <TableRow key={user.id} className="hover:bg-muted/10">
                                            <TableCell className="font-medium text-foreground">{user.fullName}</TableCell>
                                            <TableCell className="text-muted-foreground">{user.username}</TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Mail size={14} /> {user.email}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 'Admin' ? 'default' : 'outline'} className="text-xs">
                                                    {user.role === 'Admin' ? '🛡️ Admin' : user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {user.lastLogin
                                                    ? new Date(user.lastLogin).toLocaleDateString('tr-TR')
                                                    : 'Henüz giriş yok'}
                                            </TableCell>
                                            <TableCell>
                                                {user.role !== 'Admin' && (
                                                    <div className="flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                            onClick={() => setConfirmDialog({ open: true, type: 'delete', userId: user.id, userName: user.fullName })}
                                                        >
                                                            <Trash size={15} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: '', userId: null, userName: '' })}>
                <DialogContent className="sm:max-w-sm bg-card border-border text-center">
                    <div className="flex flex-col items-center pt-4">
                        <div className={`mb-4 flex items-center justify-center h-16 w-16 rounded-full ${confirmDialog.type === 'approve' ? 'bg-emerald-500/10' : 'bg-destructive/10'
                            }`}>
                            {confirmDialog.type === 'approve'
                                ? <CheckCircle className="h-8 w-8 text-emerald-500" />
                                : <XCircle className="h-8 w-8 text-destructive" />
                            }
                        </div>
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                {confirmDialog.type === 'approve'
                                    ? `"${confirmDialog.userName}" kullanıcısını onaylamak istiyor musunuz?`
                                    : `"${confirmDialog.userName}" kullanıcısını silmek istiyor musunuz?`
                                }
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-3 w-full mt-6">
                            <Button variant="outline" className="flex-1" onClick={() => setConfirmDialog({ open: false, type: '', userId: null, userName: '' })}>
                                İptal
                            </Button>
                            {confirmDialog.type === 'approve' ? (
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>
                                    Onayla
                                </Button>
                            ) : (
                                <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                                    Sil
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
