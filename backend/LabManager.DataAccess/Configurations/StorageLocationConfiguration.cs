using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class StorageLocationConfiguration : IEntityTypeConfiguration<StorageLocation>
{
    public void Configure(EntityTypeBuilder<StorageLocation> builder)
    {
        builder.ToTable("StorageLocations");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Description)
            .HasMaxLength(500);

        builder.Property(s => s.TemperatureCondition)
            .HasMaxLength(100);

        builder.Property(s => s.CapacityInfo)
            .HasMaxLength(200);

        // İlişki: Bir lokasyonda birden fazla ürün
        builder.HasMany(s => s.Products)
            .WithOne(p => p.StorageLocation)
            .HasForeignKey(p => p.StorageLocationId)
            .OnDelete(DeleteBehavior.SetNull); // Lokasyon silinirse ürünlerin lokasyonu null olsun
    }
}

