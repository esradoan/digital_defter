using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string FullName { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    public DateTime? LastLogin { get; set; }
    public ICollection<LabNote> LabNotes { get; set; } = new List<LabNote>();
}

