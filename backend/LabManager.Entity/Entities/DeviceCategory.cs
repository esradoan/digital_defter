namespace LabManager.Entity.Entities;

public class DeviceCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation property
    public ICollection<Device> Devices { get; set; } = new List<Device>();
}
