namespace LabManager.Entity.Entities;

public class LabNote : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
