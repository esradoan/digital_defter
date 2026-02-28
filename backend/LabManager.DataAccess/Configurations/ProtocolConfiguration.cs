using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class ProtocolConfiguration : IEntityTypeConfiguration<Protocol>
{
    public void Configure(EntityTypeBuilder<Protocol> builder)
    {
        builder.ToTable("Protocols");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.Description)
            .HasMaxLength(1000);

        builder.Property(p => p.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        // Kategori ilişkisi (opsiyonel)
        builder.HasOne(p => p.ProtocolCategory)
            .WithMany(pc => pc.Protocols)
            .HasForeignKey(p => p.ProtocolCategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
