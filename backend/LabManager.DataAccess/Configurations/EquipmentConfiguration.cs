using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
{
    public void Configure(EntityTypeBuilder<Equipment> builder)
    {
        builder.ToTable("Equipment");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Brand)
            .HasMaxLength(100);

        builder.Property(e => e.Model)
            .HasMaxLength(100);

        builder.Property(e => e.SerialNumber)
            .HasMaxLength(100);

        builder.Property(e => e.CalibrationStatus)
            .HasMaxLength(100);

        builder.Property(e => e.ManualFilePath)
            .HasMaxLength(500);

        builder.Property(e => e.Location)
            .HasMaxLength(200);

        builder.Property(e => e.Notes)
            .HasMaxLength(1000);

        // Index - Bakım tarihi takibi için
        builder.HasIndex(e => e.NextMaintenanceDate);
        builder.HasIndex(e => e.Status);
    }
}

