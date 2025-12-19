using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class Product : BaseEntity
{
    // Temel Bilgiler
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string? CatalogNumber { get; set; }
    public string? Brand { get; set; }
    public string? LotNumber { get; set; }
    
    // Miktar ve Stok
    public DateTime? ExpiryDate { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal? MinStockLevel { get; set; }
    
    // Saklama Bilgileri
    public StorageCondition StorageCondition { get; set; }
    public int? StorageLocationId { get; set; }
    public string? DetailedLocation { get; set; }
    public DateTime? OpeningDate { get; set; }
    
    // Diğer Bilgiler
    public string? Notes { get; set; }
    public decimal? Price { get; set; }
    public string? Supplier { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public StorageLocation? StorageLocation { get; set; }
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}

