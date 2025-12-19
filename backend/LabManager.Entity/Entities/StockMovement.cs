using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class StockMovement : BaseEntity
{
    public int ProductId { get; set; }
    public MovementType MovementType { get; set; }
    public decimal Quantity { get; set; }
    public string? Reason { get; set; }
    public int PerformedBy { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    // Navigation property
    public Product Product { get; set; } = null!;
}

