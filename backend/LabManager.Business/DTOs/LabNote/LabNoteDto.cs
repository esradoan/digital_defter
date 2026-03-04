namespace LabManager.Business.DTOs.LabNote;

public class LabNoteDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ExperimentNumber { get; set; }
    public string? ExperimentName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
