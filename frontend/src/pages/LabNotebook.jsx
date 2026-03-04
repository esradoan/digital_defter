import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash, Save, Search, Clock, Edit3, X, FileText } from 'lucide-react';
import labNoteService from '../services/labNoteService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function LabNotebook() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Seçili not
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form
    const [editForm, setEditForm] = useState({ title: '', content: '' });

    // Yeni not dialog
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
    const [newNoteForm, setNewNoteForm] = useState({ title: '', content: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await labNoteService.getAll();
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
            setNewNoteForm({ title: '', content: '' });
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
        setEditForm({ title: note.title, content: note.content });
        setIsEditing(false);
    };

    const handleStartEditing = () => {
        setEditForm({ title: selectedNote.title, content: selectedNote.content });
        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setEditForm({ title: selectedNote.title, content: selectedNote.content });
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Lab Defteri</h1>
                    <p className="text-muted-foreground mt-1">Kişisel laboratuvar notlarınız</p>
                </div>
                <Button onClick={() => setIsNewNoteOpen(true)} className="gap-2">
                    <Plus size={16} /> Yeni Not
                </Button>
            </div>

            {/* İçerik: Sol Liste + Sağ Detay */}
            <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 220px)' }}>

                {/* Sol Panel: Not Listesi */}
                <div className="w-80 flex-shrink-0 flex flex-col gap-3">
                    {/* Arama */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Notlarda ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
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
                        <Card className="h-full">
                            <CardContent className="p-6 h-full flex flex-col">
                                {/* Üst Toolbar */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock size={13} />
                                        <span>Oluşturulma: {formatDate(selectedNote.createdAt)}</span>
                                        {selectedNote.updatedAt && (
                                            <>
                                                <span>•</span>
                                                <span>Güncelleme: {formatDate(selectedNote.updatedAt)}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-1.5">
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
                                        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                            {selectedNote.content}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full">
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
