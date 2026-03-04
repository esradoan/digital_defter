using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class WarehouseItemConfiguration : IEntityTypeConfiguration<WarehouseItem>
{
    public void Configure(EntityTypeBuilder<WarehouseItem> builder)
    {
        builder.ToTable("WarehouseItems");
        builder.HasKey(wi => wi.Id);
        builder.Property(wi => wi.Name).IsRequired().HasMaxLength(200);
        builder.Property(wi => wi.Quantity).HasColumnType("decimal(18,2)");
        builder.Property(wi => wi.Unit).IsRequired().HasMaxLength(50);
        builder.Property(wi => wi.Description).HasMaxLength(1000);

        builder.HasOne(wi => wi.Warehouse)
            .WithMany(w => w.Items)
            .HasForeignKey(wi => wi.WarehouseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(wi => wi.WarehouseCategory)
            .WithMany(wc => wc.Items)
            .HasForeignKey(wi => wi.WarehouseCategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(wi => wi.WarehouseId);
        builder.HasIndex(wi => wi.WarehouseCategoryId);
    }
}
