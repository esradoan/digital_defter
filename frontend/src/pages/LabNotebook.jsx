import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash, Save, Search, Clock, Edit3, X, FileText } from 'lucide-react';
import labNoteService from '../services/labNoteService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function LabNotebook() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    // Seçili not
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form
    const [editForm, setEditForm] = useState({ title: '', content: '', experimentNumber: '', experimentName: '' });

    // Yeni not dialog
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
    const [newNoteForm, setNewNoteForm] = useState({ title: '', content: '', experimentNumber: '', experimentName: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [monthFilter, sortOrder]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await labNoteService.getAll(monthFilter, sortOrder);
            setNotes(response.data || []);
        } catch (err) {
            console.error('Not yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNoteForm.title.trim() || !newNoteForm.content.trim()) return;

        setSaving(true);
        try {
            await labNoteService.create(newNoteForm);
            setIsNewNoteOpen(false);
            setNewNoteForm({ title: '', content: '', experimentNumber: '', experimentName: '' });
            await fetchNotes();
        } catch (err) {
            console.error('Not oluşturma hatası:', err);
            alert('Not oluşturulurken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateNote = async () => {
        if (!selectedNote || !editForm.title.trim() || !editForm.content.trim()) return;

        setSaving(true);
        try {
            const response = await labNoteService.update(selectedNote.id, editForm);
            const updatedNote = response.data;
            setSelectedNote(updatedNote);
            setIsEditing(false);
            await fetchNotes();
        } catch (err) {
            console.error('Not güncelleme hatası:', err);
            alert('Not güncellenirken hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNote = async (id, title) => {
        if (!window.confirm(`"${title}" notunu silmek istediğinize emin misiniz?`)) return;
        try {
            await labNoteService.delete(id);
            if (selectedNote?.id === id) {
                setSelectedNote(null);
                setIsEditing(false);
            }
            await fetchNotes();
        } catch (err) {
            console.error('Not silme hatası:', err);
            alert('Not silinirken hata oluştu.');
        }
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setEditForm({ title: note.title, content: note.content, experimentNumber: note.experimentNumber || '', experimentName: note.experimentName || '' });
        setIsEditing(false);
    };

    const handleStartEditing = () => {
        setEditForm({ title: selectedNote.title, content: selectedNote.content, experimentNumber: selectedNote.experimentNumber || '', experimentName: selectedNote.experimentName || '' });
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setEditForm({ title: selectedNote.title, content: selectedNote.content, experimentNumber: selectedNote.experimentNumber || '', experimentName: selectedNote.experimentName || '' });
        setIsEditing(false);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Lab Defteri</h1>
                    <p className="text-muted-foreground mt-1">Kişisel laboratuvar notlarınız</p>
                </div>
                <Button onClick={() => setIsNewNoteOpen(true)} className="w-full gap-2 sm:w-auto">
                    <Plus size={16} /> Yeni Not
                </Button>
            </div>

            {/* İçerik: Sol Liste + Sağ Detay */}
            <div className="flex flex-col gap-6 lg:flex-row">

                {/* Sol Panel: Not Listesi */}
                <div className="flex w-full flex-shrink-0 flex-col gap-3 lg:w-80">
                    {/* Arama ve Filtreler */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Notlarda ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Select value={monthFilter} onValueChange={setMonthFilter}>
                            <SelectTrigger className="flex-1 text-xs">
                                <SelectValue placeholder="Ay Seçimi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Aylar</SelectItem>
                                <SelectItem value="1">Ocak</SelectItem>
                                <SelectItem value="2">Şubat</SelectItem>
                                <SelectItem value="3">Mart</SelectItem>
                                <SelectItem value="4">Nisan</SelectItem>
                                <SelectItem value="5">Mayıs</SelectItem>
                                <SelectItem value="6">Haziran</SelectItem>
                                <SelectItem value="7">Temmuz</SelectItem>
                                <SelectItem value="8">Ağustos</SelectItem>
                                <SelectItem value="9">Eylül</SelectItem>
                                <SelectItem value="10">Ekim</SelectItem>
                                <SelectItem value="11">Kasım</SelectItem>
                                <SelectItem value="12">Aralık</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="flex-1 text-xs">
                                <SelectValue placeholder="Sıralama" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Yeniden Eskiye</SelectItem>
                                <SelectItem value="asc">Eskiden Yeniye</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Not Listesi */}
                    <div className="flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                        {filteredNotes.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <BookOpen size={36} className="text-muted-foreground/50 mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        {searchTerm ? 'Aramayla eşleşen not bulunamadı' : 'Henüz not eklenmemiş'}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredNotes.map(note => (
                                <button
                                    key={note.id}
                                    onClick={() => handleSelectNote(note)}
                                    className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 ${selectedNote?.id === note.id
                                        ? 'bg-primary/10 border-primary/30 shadow-sm shadow-primary/10'
                                        : 'bg-card border-border hover:bg-muted/30 hover:border-border'
                                        }`}
                                >
                                    <h4 className="font-medium text-foreground text-sm truncate">{note.title}</h4>
                                    {(note.experimentNumber || note.experimentName) && (
                                        <div className="flex items-center gap-1 mt-1.5 mb-2">
                                            {note.experimentNumber && (
                                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                                    #{note.experimentNumber}
                                                </span>
                                            )}
                                            {note.experimentName && (
                                                <span className="text-[10px] text-muted-foreground truncate">
                                                    {note.experimentName}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
                                        <Clock size={11} />
                                        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Sağ Panel: Not Detayı / Düzenleme */}
                <div className="flex-1">
                    {selectedNote ? (
                        <Card className="h-full min-h-[420px]">
                            <CardContent className="flex h-full flex-col p-4 sm:p-6">
                                {/* Üst Toolbar */}
                                <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <Clock size={13} />
                                        <span>Oluşturulma: {formatDate(selectedNote.createdAt)}</span>
                                        {selectedNote.updatedAt && (
                                            <>
                                                <span>•</span>
                                                <span>Güncelleme: {formatDate(selectedNote.updatedAt)}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5 sm:flex-row">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                                                    onClick={handleCancelEditing}
                                                >
                                                    <X size={14} /> İptal
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="gap-1.5"
                                                    onClick={handleUpdateNote}
                                                    disabled={saving}
                                                >
                                                    <Save size={14} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                                                    onClick={handleStartEditing}
                                                >
                                                    <Edit3 size={14} /> Düzenle
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    onClick={() => handleDeleteNote(selectedNote.id, selectedNote.title)}
                                                >
                                                    <Trash size={14} /> Sil
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* İçerik */}
                                {isEditing ? (
                                    <div className="flex-1 flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm text-muted-foreground mb-2">Başlık</label>
                                            <Input
                                                value={editForm.title}
                                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                placeholder="Not başlığı"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm text-muted-foreground mb-2">Deney No</label>
                                                <Input
                                                    value={editForm.experimentNumber}
                                                    onChange={e => setEditForm({ ...editForm, experimentNumber: e.target.value })}
                                                    placeholder="Örn: EXP-001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-muted-foreground mb-2">Deney Adı</label>
                                                <Input
                                                    value={editForm.experimentName}
                                                    onChange={e => setEditForm({ ...editForm, experimentName: e.target.value })}
                                                    placeholder="Deneyin kısa adı"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label className="block text-sm text-muted-foreground mb-2">İçerik</label>
                                            <textarea
                                                value={editForm.content}
                                                onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                                                placeholder="Notunuzu yazın..."
                                                className="flex-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                                style={{ minHeight: '300px' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-foreground mb-4">{selectedNote.title}</h2>
                                        {(selectedNote.experimentNumber || selectedNote.experimentName) && (
                                            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/50 p-4 sm:flex-row sm:items-center">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-muted-foreground mb-0.5">Deney Bilgisi</div>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                                                        {selectedNote.experimentNumber && (
                                                            <span className="text-primary font-semibold">#{selectedNote.experimentNumber}</span>
                                                        )}
                                                        {selectedNote.experimentNumber && selectedNote.experimentName && (
                                                            <span className="text-muted-foreground/30">•</span>
                                                        )}
                                                        {selectedNote.experimentName && (
                                                            <span>{selectedNote.experimentName}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                            {selectedNote.content}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full min-h-[320px]">
                            <CardContent className="flex flex-col items-center justify-center h-full py-24 text-center">
                                <FileText size={48} className="text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground/70 mb-1">Bir not seçin</h3>
                                <p className="text-sm text-muted-foreground/50">
                                    Sol listeden bir not seçerek detaylarını görüntüleyin
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Yeni Not Dialog */}
            <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
                <DialogContent className="sm:max-w-lg bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Yeni Not Oluştur</DialogTitle>
                        <DialogDescription>
                            Lab defterinize yeni bir not ekleyin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateNote} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Başlık</label>
                            <Input
                                value={newNoteForm.title}
                                onChange={e => setNewNoteForm({ ...newNoteForm, title: e.target.value })}
                                placeholder="Not başlığı"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Deney No</label>
                                <Input
                                    value={newNoteForm.experimentNumber}
                                    onChange={e => setNewNoteForm({ ...newNoteForm, experimentNumber: e.target.value })}
                                    placeholder="Örn: EXP-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Deney Adı</label>
                                <Input
                                    value={newNoteForm.experimentName}
                                    onChange={e => setNewNoteForm({ ...newNoteForm, experimentName: e.target.value })}
                                    placeholder="Deneyin kısa adı"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">İçerik</label>
                            <textarea
                                value={newNoteForm.content}
                                onChange={e => setNewNoteForm({ ...newNoteForm, content: e.target.value })}
                                placeholder="Notunuzu yazın..."
                                rows={8}
                                required
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!newNoteForm.title.trim() || !newNoteForm.content.trim() || saving}>
                            <Plus size={16} className="mr-2" />
                            {saving ? 'Kaydediliyor...' : 'Not Oluştur'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
