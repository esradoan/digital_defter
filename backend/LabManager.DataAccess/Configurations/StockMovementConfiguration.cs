using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class StockMovementConfiguration : IEntityTypeConfiguration<StockMovement>
{
    public void Configure(EntityTypeBuilder<StockMovement> builder)
    {
        builder.ToTable("StockMovements");
        builder.HasKey(sm => sm.Id);

        builder.Property(sm => sm.Quantity)
            .HasPrecision(18, 2);

        builder.Property(sm => sm.Reason)
            .HasMaxLength(500);

        builder.Property(sm => sm.Notes)
            .HasMaxLength(1000);

        // İlişki
        builder.HasOne(sm => sm.Product)
            .WithMany(p => p.StockMovements)
            .HasForeignKey(sm => sm.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Index - Tarih ve ürün bazlı arama için
        builder.HasIndex(sm => sm.Date);
        builder.HasIndex(sm => sm.ProductId);
    }
}

