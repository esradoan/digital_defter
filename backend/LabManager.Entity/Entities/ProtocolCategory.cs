namespace LabManager.Entity.Entities;

public class ProtocolCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation property
    public ICollection<Protocol> Protocols { get; set; } = new List<Protocol>();
}
