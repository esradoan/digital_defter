using System.ComponentModel.DataAnnotations;
using LabManager.Entity.Enums;

namespace LabManager.Business.DTOs.Product;

public class CreateProductDto
{
    [StringLength(200)]
    public string? Name { get; set; }

    public int? CategoryId { get; set; }
    
    [StringLength(100)]
    public string? SerialNumber { get; set; } // Yeni alan

    [StringLength(100)]
    public string? CatalogNumber { get; set; }

    [StringLength(100)]
    public string? Brand { get; set; }

    [StringLength(100)]
    public string? LotNumber { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public decimal Quantity { get; set; } // Varsayılan 0 olabilir

    [StringLength(50)]
    public string? Unit { get; set; } // Opsiyonel

    public decimal? MinStockLevel { get; set; }

    public StorageCondition? StorageCondition { get; set; }

    public int? StorageLocationId { get; set; }

    [StringLength(200)]
    public string? DetailedLocation { get; set; }

    public DateTime? OpeningDate { get; set; }

    public string? Notes { get; set; }

    public decimal? Price { get; set; }

    [StringLength(100)]
    public string? Supplier { get; set; }
}

