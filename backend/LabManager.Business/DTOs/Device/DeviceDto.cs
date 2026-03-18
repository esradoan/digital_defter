namespace LabManager.Business.DTOs.Device;

public class DeviceDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BrandModel { get; set; }
    public string? Description { get; set; }
    public int? DeviceCategoryId { get; set; }
    public string? CategoryName { get; set; }
    public string? ManualFileUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateDeviceDto
{
    public string Name { get; set; } = string.Empty;
    public string? BrandModel { get; set; }
    public string? Description { get; set; }
    public int? DeviceCategoryId { get; set; }
    public string? ManualFileUrl { get; set; }
}

public class DeviceCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DeviceCount { get; set; }
}
