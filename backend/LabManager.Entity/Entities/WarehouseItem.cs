namespace LabManager.Entity.Entities;

public class WarehouseItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "adet"; // adet, litre, gram, ml, kg, kutu
    public string? Description { get; set; }

    // İlişkiler
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;

    public int? WarehouseCategoryId { get; set; }
    public WarehouseCategory? WarehouseCategory { get; set; }
}
