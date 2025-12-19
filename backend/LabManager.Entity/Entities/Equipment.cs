using LabManager.Entity.Enums;

namespace LabManager.Entity.Entities;

public class Equipment : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? SerialNumber { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyEndDate { get; set; }
    public int? MaintenancePeriodDays { get; set; }
    public DateTime? LastMaintenanceDate { get; set; }
    public DateTime? NextMaintenanceDate { get; set; }
    public string? CalibrationStatus { get; set; }
    public string? ManualFilePath { get; set; }
    public EquipmentStatus Status { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
}

