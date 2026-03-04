using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class WarehouseCategoryConfiguration : IEntityTypeConfiguration<WarehouseCategory>
{
    public void Configure(EntityTypeBuilder<WarehouseCategory> builder)
    {
        builder.ToTable("WarehouseCategories");
        builder.HasKey(wc => wc.Id);
        builder.Property(wc => wc.Name).IsRequired().HasMaxLength(100);
        builder.Property(wc => wc.Description).HasMaxLength(500);
    }
}
