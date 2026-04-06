import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash, Trash2, Download, FolderPlus, File, FileImage, FileSpreadsheet, ChevronDown, ChevronRight, Layers, Search } from 'lucide-react';
import protocolService from '../services/protocolService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ACCEPTED_PROTOCOL_FILE_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.gif,.bmp';

const getFileExtension = (fileName = '') => {
    const parts = fileName.toLowerCase().split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
};

const getProtocolType = (protocol = {}) => {
    const contentType = protocol.contentType?.toLowerCase() || '';
    const extension = getFileExtension(protocol.fileName);

    if (contentType.includes('pdf') || extension === '.pdf') return 'pdf';
    if (contentType.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes(extension)) return 'image';
    if (contentType.includes('word') || contentType.includes('msword') || extension === '.doc' || extension === '.docx') return 'word';
    if (contentType.includes('sheet') || contentType.includes('excel') || extension === '.xls' || extension === '.xlsx') return 'excel';

    return 'other';
};

const isPreviewableProtocol = (protocol) => ['pdf', 'image'].includes(getProtocolType(protocol));

export default function Protocols() {
    const [protocols, setProtocols] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Upload dialog
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', description: '', categoryId: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Category dialog
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Preview dialog
    const [previewProtocol, setPreviewProtocol] = useState(null);
    const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [protocolsData, categoriesData] = await Promise.all([
                protocolService.getAll(),
                protocolService.getCategories()
            ]);
            setProtocols(protocolsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Veri yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !uploadForm.title.trim()) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', uploadForm.title);
            if (uploadForm.description) formData.append('description', uploadForm.description);
            if (uploadForm.categoryId) formData.append('protocolCategoryId', uploadForm.categoryId);

            await protocolService.upload(formData);
            setIsUploadOpen(false);
            setUploadForm({ title: '', description: '', categoryId: '' });
            setSelectedFile(null);
            fetchData();
        } catch (err) {
            console.error('Yükleme hatası:', err);
            alert(err.response?.data?.message || 'Dosya yüklenirken hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`"${title}" protokolünü silmek istediğinize emin misiniz?`)) return;
        try {
            await protocolService.delete(id);
            fetchData();
        } catch (err) {
            console.error('Silme hatası:', err);
            alert('Protokol silinirken hata oluştu.');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await protocolService.createCategory({ name: newCategoryName.trim() });
            setNewCategoryName('');
            setIsCategoryOpen(false);
            fetchData();
        } catch (err) {
            console.error('Kategori ekleme hatası:', err);
            alert('Kategori eklenirken hata oluştu.');
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (!window.confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) return;
        try {
            await protocolService.deleteCategory(catId);
            fetchData();
        } catch (err) {
            console.error('Kategori silme hatası:', err);
            alert('Kategori silinirken hata oluştu.');
        }
    };

    const handlePreview = async (protocol) => {
        if (previewBlobUrl) window.URL.revokeObjectURL(previewBlobUrl);
        setPreviewProtocol(protocol);
        setPreviewBlobUrl(null);

        if (!isPreviewableProtocol(protocol)) {
            setIsPreviewLoading(false);
            return;
        }

        setIsPreviewLoading(true);
        try {
            const url = await protocolService.getPreviewBlobUrl(protocol.id);
            setPreviewBlobUrl(url);
        } catch (err) {
            console.error('Önizleme hatası:', err);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleClosePreview = () => {
        if (previewBlobUrl) window.URL.revokeObjectURL(previewBlobUrl);
        setPreviewProtocol(null);
        setPreviewBlobUrl(null);
        setIsPreviewLoading(false);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (contentType) => {
        if (contentType?.includes('pdf')) return <FileText size={20} className="text-red-400" />;
        if (contentType?.includes('image')) return <FileImage size={20} className="text-emerald-400" />;
        if (contentType?.includes('spreadsheet') || contentType?.includes('excel')) return <FileSpreadsheet size={20} className="text-green-400" />;
        return <File size={20} className="text-sky-400" />;
    };

    const previewType = getProtocolType(previewProtocol || {});

    // Arama filtresi
    const filteredProtocols = protocols.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Kategorilere göre grupla
    const uncategorized = filteredProtocols.filter(p => !p.protocolCategoryId);
    const groupedByCategory = categories.map(cat => ({
        ...cat,
        items: filteredProtocols.filter(p => p.protocolCategoryId === cat.id)
    }));

    const ProtocolCard = ({ protocol }) => (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors">
            <div className="flex-shrink-0">
                {getFileIcon(protocol.contentType)}
            </div>
            <div className="flex-1 min-w-0">
                <button
                    onClick={() => handlePreview(protocol)}
                    className="font-medium text-sm text-foreground hover:text-primary hover:underline text-left cursor-pointer truncate max-w-full"
                >
                    {protocol.title}
                </button>
                {protocol.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{protocol.description}</p>
                )}
                <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>{protocol.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(protocol.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(protocol.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
                    onClick={() => protocolService.downloadFile(protocol).catch(err => console.error('İndirme hatası:', err))}
                    title="İndir"
                >
                    <Download size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleDelete(protocol.id, protocol.title)}
                    title="Sil"
                >
                    <Trash size={16} />
                </Button>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Protokoller</h1>
                    <p className="text-muted-foreground mt-1">Laboratuvar protokollerinizi yönetin</p>
                </div>
                <Button onClick={() => setIsUploadOpen(true)} className="w-full gap-2 sm:w-auto">
                    <Upload size={16} /> Protokol Yükle
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Protokol ara..."
                    className="pl-10"
                />
            </div>

            {/* Section Title */}
            <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Layers size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground m-0">Kategori Bölmeleri</h2>
                <span className="flex-1 text-sm text-muted-foreground">— Kategoriye tıklayarak protokolleri görüntüleyin</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCategoryOpen(true)}
                    className="w-full gap-1.5 sm:w-auto"
                >
                    <FolderPlus size={15} /> Kategori Ekle
                </Button>
            </div>

            {/* Kategorilere göre bölmeler */}
            <div className="space-y-3">
                {groupedByCategory.map((cat) => (
                    <Card key={cat.id}>
                        <Collapsible
                            open={openCategoryId === cat.id}
                            onOpenChange={() => setOpenCategoryId(openCategoryId === cat.id ? null : cat.id)}
                        >
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === cat.id
                                            ? <ChevronDown size={18} className="text-primary" />
                                            : <ChevronRight size={18} className="text-muted-foreground" />
                                        }
                                        <FileText size={18} className="text-primary/70" />
                                        <span className="font-semibold text-foreground">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">{cat.items.length} protokol</Badge>
                                        <Trash2
                                            size={14}
                                            className="text-muted-foreground hover:text-red-400 cursor-pointer transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }}
                                        />
                                    </div>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    {cat.items.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-6">Bu kategoride henüz protokol yok</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {cat.items.map(p => <ProtocolCard key={p.id} protocol={p} />)}
                                        </div>
                                    )}
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                ))}

                {/* Kategorisiz Protokoller */}
                {uncategorized.length > 0 && (
                    <Card>
                        <Collapsible
                            open={openCategoryId === 'uncategorized'}
                            onOpenChange={() => setOpenCategoryId(openCategoryId === 'uncategorized' ? null : 'uncategorized')}
                        >
                            <CollapsibleTrigger asChild>
                                <button className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/10 transition-colors rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {openCategoryId === 'uncategorized'
                                            ? <ChevronDown size={18} className="text-primary" />
                                            : <ChevronRight size={18} className="text-muted-foreground" />
                                        }
                                        <File size={18} className="text-muted-foreground" />
                                        <span className="font-semibold text-foreground">Kategorisiz</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{uncategorized.length} protokol</Badge>
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <CardContent className="pt-0 pb-4 px-4">
                                    <div className="space-y-2">
                                        {uncategorized.map(p => <ProtocolCard key={p.id} protocol={p} />)}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )}

                {protocols.length === 0 && categories.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText size={48} className="text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-1">Henüz protokol yok</h3>
                            <p className="text-sm text-muted-foreground mb-4">İlk protokolünüzü yükleyerek başlayın</p>
                            <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
                                <Upload size={16} /> Protokol Yükle
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Protokol Yükle</DialogTitle>
                        <DialogDescription>
                            Dosyanızı yükleyin ve bilgilerini girin.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpload} className="flex flex-col gap-4 mt-2">
                        {/* Dosya Seçimi */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Dosya</label>
                            <div
                                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {selectedFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <File size={20} className="text-primary" />
                                        <span className="text-sm text-foreground">{selectedFile.name}</span>
                                        <span className="text-xs text-muted-foreground">({formatFileSize(selectedFile.size)})</span>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Dosya seçmek için tıklayın</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel ve resim dosyaları desteklenir.</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_PROTOCOL_FILE_TYPES}
                                className="hidden"
                                onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                            />
                        </div>

                        {/* Başlık */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Başlık</label>
                            <Input
                                value={uploadForm.title}
                                onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                                placeholder="Protokol başlığı"
                                required
                            />
                        </div>

                        {/* Açıklama */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Açıklama / Not</label>
                            <textarea
                                value={uploadForm.description}
                                onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                                placeholder="Kısa açıklama veya not..."
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori</label>
                            <Select
                                value={uploadForm.categoryId}
                                onValueChange={val => setUploadForm({ ...uploadForm, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={!selectedFile || !uploadForm.title.trim() || uploading}>
                            <Upload size={16} className="mr-2" />
                            {uploading ? 'Yükleniyor...' : 'Yükle'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent className="sm:max-w-sm bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        <DialogDescription>
                            Protokoller için yeni bir kategori oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCategory} className="flex flex-col gap-4 mt-2">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Kategori Adı</label>
                            <Input
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                placeholder="Örn: SOP, Deney Protokolleri, Güvenlik..."
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <FolderPlus size={16} className="mr-2" /> Kategori Oluştur
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={!!previewProtocol} onOpenChange={(open) => { if (!open) handleClosePreview(); }}>
                <DialogContent className="sm:max-w-4xl bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>{previewProtocol?.title}</DialogTitle>
                        {previewProtocol?.description && (
                            <DialogDescription>{previewProtocol.description}</DialogDescription>
                        )}
                    </DialogHeader>
                    <div className="w-full h-[70vh] bg-muted rounded overflow-hidden flex items-center justify-center">
                        {isPreviewLoading ? (
                            <p className="text-muted-foreground text-sm">Yükleniyor...</p>
                        ) : previewType === 'pdf' && previewBlobUrl ? (
                            <iframe
                                src={previewBlobUrl}
                                className="w-full h-full"
                                title={previewProtocol?.title}
                            />
                        ) : previewType === 'image' && previewBlobUrl ? (
                            <img
                                src={previewBlobUrl}
                                alt={previewProtocol?.title}
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : previewType === 'word' || previewType === 'excel' ? (
                            <div className="px-6 text-center">
                                <p className="text-sm text-foreground">Bu dosya türü uygulama içinde önizlenemiyor.</p>
                                <p className="mt-2 text-sm text-muted-foreground">Dosyayı görmek için indirip bilgisayarınızda açın.</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">Önizleme yüklenemedi.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => protocolService.downloadFile(previewProtocol).catch(console.error)}
                        >
                            <Download size={16} className="mr-2" /> İndir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
