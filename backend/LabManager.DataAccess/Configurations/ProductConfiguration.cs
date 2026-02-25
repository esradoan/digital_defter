using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);

        // Temel property'ler
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.CatalogNumber)
            .HasMaxLength(100);

        builder.Property(p => p.Brand)
            .HasMaxLength(100);

        builder.Property(p => p.LotNumber)
            .HasMaxLength(100);

        builder.Property(p => p.Unit)
            .HasMaxLength(50);

        builder.Property(p => p.DetailedLocation)
            .HasMaxLength(200);

        builder.Property(p => p.Supplier)
            .HasMaxLength(100);

        // Decimal için precision
        builder.Property(p => p.Quantity)
            .HasPrecision(18, 2); // 18 basamak, 2 ondalık

        builder.Property(p => p.MinStockLevel)
            .HasPrecision(18, 2);

        builder.Property(p => p.Price)
            .HasPrecision(18, 2);

        // İlişkiler
        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.StorageLocation)
            .WithMany(s => s.Products)
            .HasForeignKey(p => p.StorageLocationId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(p => p.StockMovements)
            .WithOne(sm => sm.Product)
            .HasForeignKey(sm => sm.ProductId)
            .OnDelete(DeleteBehavior.Cascade); // Ürün silinirse hareketleri de silinsin

        // Index'ler - Arama performansı için
        builder.HasIndex(p => p.CatalogNumber);
        builder.HasIndex(p => p.ExpiryDate);
        builder.HasIndex(p => p.CategoryId);
    }
}

