namespace LabManager.Entity.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }

    // Navigation property - Bu kategoriye ait ürünler
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

