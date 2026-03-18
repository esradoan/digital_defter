namespace LabManager.Entity.Entities;

public class Device : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? BrandModel { get; set; }
    public string? Description { get; set; }
    public string? ManualFileUrl { get; set; }

    // Kategori ilişkisi
    public int? DeviceCategoryId { get; set; }
    public DeviceCategory? DeviceCategory { get; set; }
}
