namespace LabManager.Entity.Entities;

public class Protocol : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // Dosya bilgileri
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }

    // Kategori ilişkisi
    public int? ProtocolCategoryId { get; set; }
    public ProtocolCategory? ProtocolCategory { get; set; }
}
