namespace LabManager.Entity.Entities;

public class WarehouseCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation
    public ICollection<WarehouseItem> Items { get; set; } = new List<WarehouseItem>();
}
