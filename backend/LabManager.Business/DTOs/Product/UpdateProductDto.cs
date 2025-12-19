using System.ComponentModel.DataAnnotations;
using LabManager.Entity.Enums;

namespace LabManager.Business.DTOs.Product;

public class UpdateProductDto
{
    [Required]
    public int Id { get; set; }

    [Required(ErrorMessage = "Ürün adı zorunludur")]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kategori seçimi zorunludur")]
    public int CategoryId { get; set; }

    [StringLength(100)]
    public string? CatalogNumber { get; set; }

    [StringLength(100)]
    public string? Brand { get; set; }

    [StringLength(100)]
    public string? LotNumber { get; set; }

    public DateTime? ExpiryDate { get; set; }

    [Required(ErrorMessage = "Miktar zorunludur")]
    [Range(0, double.MaxValue, ErrorMessage = "Miktar 0'dan büyük olmalıdır")]
    public decimal Quantity { get; set; }

    [Required(ErrorMessage = "Birim zorunludur")]
    [StringLength(50)]
    public string Unit { get; set; } = string.Empty;

    public decimal? MinStockLevel { get; set; }

    [Required(ErrorMessage = "Saklama koşulu zorunludur")]
    public StorageCondition StorageCondition { get; set; }

    public int? StorageLocationId { get; set; }

    [StringLength(200)]
    public string? DetailedLocation { get; set; }

    public DateTime? OpeningDate { get; set; }

    public string? Notes { get; set; }

    public decimal? Price { get; set; }

    [StringLength(100)]
    public string? Supplier { get; set; }
}

