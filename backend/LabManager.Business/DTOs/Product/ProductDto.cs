namespace LabManager.Business.DTOs.Product;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? CatalogNumber { get; set; }
    public string? Brand { get; set; }
    public string? LotNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal? MinStockLevel { get; set; }
    public string StorageCondition { get; set; } = string.Empty;
    public int? StorageLocationId { get; set; }
    public string? StorageLocationName { get; set; }
    public string? DetailedLocation { get; set; }
    public DateTime? OpeningDate { get; set; }
    public string? Notes { get; set; }
    public decimal? Price { get; set; }
    public string? Supplier { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Computed properties (Hesaplanan alanlar)
    public bool IsLowStock { get; set; }
    public bool IsExpiringSoon { get; set; }
}

