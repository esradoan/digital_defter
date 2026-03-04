using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class DeviceCategoryConfiguration : IEntityTypeConfiguration<DeviceCategory>
{
    public void Configure(EntityTypeBuilder<DeviceCategory> builder)
    {
        builder.ToTable("DeviceCategories");
        builder.HasKey(dc => dc.Id);

        builder.Property(dc => dc.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(dc => dc.Description)
            .HasMaxLength(500);
    }
}
