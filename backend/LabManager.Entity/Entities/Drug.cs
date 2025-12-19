using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class Drug : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? LotNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Concentration { get; set; }
    public string? Solvent { get; set; }
    public DateTime? PreparationDate { get; set; }
    public decimal Quantity { get; set; }
    public StorageCondition StorageCondition { get; set; }
    public string? AliquotInfo { get; set; }
    public string? ExperimentProtocol { get; set; }
    public string? Notes { get; set; }
}

