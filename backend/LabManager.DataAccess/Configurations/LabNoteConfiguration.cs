using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Configurations;

public class LabNoteConfiguration : IEntityTypeConfiguration<LabNote>
{
    public void Configure(EntityTypeBuilder<LabNote> builder)
    {
        builder.ToTable("LabNotes");

        builder.HasKey(n => n.Id);

        builder.Property(n => n.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(n => n.Content)
            .IsRequired()
            .HasColumnType("longtext");

        builder.HasOne(n => n.User)
            .WithMany(u => u.LabNotes)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => n.UserId);
    }
}
