using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.LabNote;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LabNotesController : ControllerBase
{
    private readonly ILabNoteService _labNoteService;

    public LabNotesController(ILabNoteService labNoteService)
    {
        _labNoteService = labNoteService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
            ?? User.FindFirst("sub");

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");

        return userId;
    }

    /// <summary>
    /// Kullanıcının tüm notlarını listele
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<LabNoteDto>>>> GetAll([FromQuery] int? month, [FromQuery] string sortOrder = "desc")
    {
        var userId = GetUserId();
        var notes = await _labNoteService.GetUserNotesAsync(userId, month, sortOrder);
        return Ok(ApiResponse<IEnumerable<LabNoteDto>>.SuccessResponse(notes));
    }

    /// <summary>
    /// Tekil not getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<LabNoteDto>>> GetById(int id)
    {
        var userId = GetUserId();
        var note = await _labNoteService.GetByIdAsync(id, userId);

        if (note == null)
            return NotFound(ApiResponse<LabNoteDto>.ErrorResponse("Not bulunamadı"));

        return Ok(ApiResponse<LabNoteDto>.SuccessResponse(note));
    }

    /// <summary>
    /// Yeni not oluştur
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<LabNoteDto>>> Create([FromBody] CreateLabNoteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<LabNoteDto>.ErrorResponse("Geçersiz veri"));

        var userId = GetUserId();
        var note = await _labNoteService.CreateAsync(dto, userId);
        return Ok(ApiResponse<LabNoteDto>.SuccessResponse(note, "Not başarıyla oluşturuldu"));
    }

    /// <summary>
    /// Notu güncelle
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<LabNoteDto>>> Update(int id, [FromBody] UpdateLabNoteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<LabNoteDto>.ErrorResponse("Geçersiz veri"));

        var userId = GetUserId();
        var note = await _labNoteService.UpdateAsync(id, dto, userId);

        if (note == null)
            return NotFound(ApiResponse<LabNoteDto>.ErrorResponse("Not bulunamadı veya yetkiniz yok"));

        return Ok(ApiResponse<LabNoteDto>.SuccessResponse(note, "Not başarıyla güncellendi"));
    }

    /// <summary>
    /// Notu sil
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var userId = GetUserId();
        var result = await _labNoteService.DeleteAsync(id, userId);

        if (!result)
            return NotFound(ApiResponse<bool>.ErrorResponse("Not bulunamadı veya yetkiniz yok"));

        return Ok(ApiResponse<bool>.SuccessResponse(true, "Not başarıyla silindi"));
    }

    /// <summary>
    /// Kullanıcının notlarını CSV olarak dışa aktar
    /// </summary>
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportToCsv()
    {
        var userId = GetUserId();
        var notes = await _labNoteService.GetUserNotesAsync(userId, null, "desc");

        var builder = new StringBuilder();
        builder.AppendLine("Tarih,Not(İçerik),Deney No,Deney Adı");

        foreach (var note in notes)
        {
            var date = note.CreatedAt.ToString("yyyy-MM-dd HH:mm");
            
            // CSV'de hücre içindeki virgülleri ve yeni satırları korumak için text alanını çift tırnak içine alıyoruz
            var text = note.Content?.Replace("\"", "\"\"") ?? "";
            text = $"\"{text}\"";

            var expNum = note.ExperimentNumber ?? "";
            var expName = note.ExperimentName ?? "";

            builder.AppendLine($"{date},{text},{expNum},{expName}");
        }

        var bytes = Encoding.UTF8.GetBytes(builder.ToString());
        return File(bytes, "text/csv", $"LabNotes_Export_{DateTime.Now:yyyyMMdd}.csv");
    }
}
