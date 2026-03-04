using LabManager.Business.DTOs.LabNote;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class LabNoteService : ILabNoteService
{
    private readonly IRepository<LabNote> _labNoteRepository;

    public LabNoteService(IRepository<LabNote> labNoteRepository)
    {
        _labNoteRepository = labNoteRepository;
    }

    public async Task<IEnumerable<LabNoteDto>> GetUserNotesAsync(int userId, int? month = null, string sortOrder = "desc")
    {
        var notes = await _labNoteRepository.FindAsync(n => n.UserId == userId);

        if (month.HasValue && month.Value is >= 1 and <= 12)
        {
            notes = notes.Where(n => n.CreatedAt.Month == month.Value);
        }

        if (sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase))
        {
            notes = notes.OrderBy(n => n.CreatedAt);
        }
        else
        {
            notes = notes.OrderByDescending(n => n.CreatedAt);
        }

        return notes.Select(n => MapToDto(n));
    }

    public async Task<LabNoteDto?> GetByIdAsync(int id, int userId)
    {
        var note = await _labNoteRepository.GetByIdAsync(id);

        // Kullanıcı kontrolü: sadece kendi notunu görebilir
        if (note == null || note.UserId != userId)
            return null;

        return MapToDto(note);
    }

    public async Task<LabNoteDto> CreateAsync(CreateLabNoteDto dto, int userId)
    {
        var note = new LabNote
        {
            Title = dto.Title,
            Content = dto.Content,
            ExperimentNumber = dto.ExperimentNumber,
            ExperimentName = dto.ExperimentName,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _labNoteRepository.AddAsync(note);
        return MapToDto(created);
    }

    public async Task<LabNoteDto?> UpdateAsync(int id, UpdateLabNoteDto dto, int userId)
    {
        var note = await _labNoteRepository.GetByIdAsync(id);

        // Kullanıcı kontrolü: sadece kendi notunu düzenleyebilir
        if (note == null || note.UserId != userId)
            return null;

        note.Title = dto.Title;
        note.Content = dto.Content;
        note.ExperimentNumber = dto.ExperimentNumber;
        note.ExperimentName = dto.ExperimentName;
        note.UpdatedAt = DateTime.UtcNow;

        await _labNoteRepository.UpdateAsync(note);
        return MapToDto(note);
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var note = await _labNoteRepository.GetByIdAsync(id);

        // Kullanıcı kontrolü: sadece kendi notunu silebilir
        if (note == null || note.UserId != userId)
            return false;

        await _labNoteRepository.DeleteAsync(note);
        return true;
    }

    private static LabNoteDto MapToDto(LabNote note)
    {
        return new LabNoteDto
        {
            Id = note.Id,
            Title = note.Title,
            Content = note.Content,
            ExperimentNumber = note.ExperimentNumber,
            ExperimentName = note.ExperimentName,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        };
    }
}
