using LabManager.Business.DTOs.LabNote;

namespace LabManager.Business.Services.Interfaces;

public interface ILabNoteService
{
    Task<IEnumerable<LabNoteDto>> GetUserNotesAsync(int userId, int? month = null, string sortOrder = "desc");
    Task<LabNoteDto?> GetByIdAsync(int id, int userId);
    Task<LabNoteDto> CreateAsync(CreateLabNoteDto dto, int userId);
    Task<LabNoteDto?> UpdateAsync(int id, UpdateLabNoteDto dto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}
