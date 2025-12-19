using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class StorageLocation : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public StorageLocationType Type { get; set; }
    public string? Description { get; set; }
    public string? TemperatureCondition { get; set; }
    public string? CapacityInfo { get; set; }

    // Navigation property - Bu lokasyonda bulunan ürünler
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

