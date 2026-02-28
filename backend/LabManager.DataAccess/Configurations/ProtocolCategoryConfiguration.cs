using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class ProtocolCategoryConfiguration : IEntityTypeConfiguration<ProtocolCategory>
{
    public void Configure(EntityTypeBuilder<ProtocolCategory> builder)
    {
        builder.ToTable("ProtocolCategories");

        builder.HasKey(pc => pc.Id);

        builder.Property(pc => pc.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(pc => pc.Description)
            .HasMaxLength(500);
    }
}
