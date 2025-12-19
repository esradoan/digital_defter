using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class DrugConfiguration : IEntityTypeConfiguration<Drug>
{
    public void Configure(EntityTypeBuilder<Drug> builder)
    {
        builder.ToTable("Drugs");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.LotNumber)
            .HasMaxLength(100);

        builder.Property(d => d.Concentration)
            .HasMaxLength(100);

        builder.Property(d => d.Solvent)
            .HasMaxLength(100);

        builder.Property(d => d.AliquotInfo)
            .HasMaxLength(500);

        builder.Property(d => d.ExperimentProtocol)
            .HasMaxLength(500);

        builder.Property(d => d.Notes)
            .HasMaxLength(1000);

        builder.Property(d => d.Quantity)
            .HasPrecision(18, 2);

        // Index
        builder.HasIndex(d => d.ExpiryDate);
    }
}

