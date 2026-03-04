using System.ComponentModel.DataAnnotations;

namespace LabManager.Business.DTOs.LabNote;

public class UpdateLabNoteDto
{
    [Required(ErrorMessage = "Başlık zorunludur")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Başlık 1-200 karakter arası olmalıdır")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "İçerik zorunludur")]
    public string Content { get; set; } = string.Empty;

    [StringLength(50, ErrorMessage = "Deney No 50 karakteri geçemez")]
    public string? ExperimentNumber { get; set; }

    [StringLength(200, ErrorMessage = "Deney Adı 200 karakteri geçemez")]
    public string? ExperimentName { get; set; }
}
