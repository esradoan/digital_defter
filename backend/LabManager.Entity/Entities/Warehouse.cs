namespace LabManager.Entity.Entities;

public class Warehouse : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }

    // Navigation
    public ICollection<WarehouseItem> Items { get; set; } = new List<WarehouseItem>();
}
