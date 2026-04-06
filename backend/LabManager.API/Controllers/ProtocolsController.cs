using Microsoft.AspNetCore.Mvc;
using LabManager.API.Infrastructure;
using LabManager.Business.DTOs.Protocol;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProtocolsController : ControllerBase
{
    private readonly IProtocolService _protocolService;
    private readonly IWebHostEnvironment _env;

    public ProtocolsController(IProtocolService protocolService, IWebHostEnvironment env)
    {
        _protocolService = protocolService;
        _env = env;
    }

    /// <summary>
    /// Tüm protokolleri listele
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProtocolDto>>>> GetAll()
    {
        var protocols = await _protocolService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<ProtocolDto>>.SuccessResponse(protocols));
    }

    /// <summary>
    /// Dosya yükle ve protokol oluştur
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50MB limit
    public async Task<ActionResult<ApiResponse<ProtocolDto>>> Create(
        [FromForm] string title,
        [FromForm] string? description,
        [FromForm] int? protocolCategoryId,
        IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<ProtocolDto>.ErrorResponse("Dosya seçilmedi"));

        var originalFileName = Path.GetFileName(file.FileName);
        if (string.IsNullOrWhiteSpace(originalFileName))
            return BadRequest(ApiResponse<ProtocolDto>.ErrorResponse("Geçerli bir dosya adı gerekli"));

        if (!ProtocolFileTypes.TryNormalize(originalFileName, file.ContentType, out var normalizedContentType))
            return BadRequest(ApiResponse<ProtocolDto>.ErrorResponse("Desteklenen dosya türleri: PDF, Word, Excel ve resim dosyaları"));

        try
        {
            // Uploads klasörünü oluştur
            var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "Protocols");
            Directory.CreateDirectory(uploadsDir);

            // Benzersiz dosya adı
            var uniqueFileName = $"{Guid.NewGuid()}_{originalFileName}";
            var filePath = Path.Combine(uploadsDir, uniqueFileName);

            // Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var protocol = await _protocolService.CreateAsync(
                title,
                description,
                originalFileName,
                filePath,
                normalizedContentType,
                file.Length,
                protocolCategoryId);

            return Ok(ApiResponse<ProtocolDto>.SuccessResponse(protocol, "Protokol başarıyla yüklendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ProtocolDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Protokol sil
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            await _protocolService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Protokol silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Dosya indir
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(int id)
    {
        var fileInfo = await _protocolService.GetFileInfoAsync(id);
        if (fileInfo == null)
            return NotFound();

        var (filePath, fileName, contentType) = fileInfo.Value;

        if (!System.IO.File.Exists(filePath))
            return NotFound("Dosya bulunamadı");

        var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        var normalizedContentType = ProtocolFileTypes.GetContentType(fileName, contentType);
        return File(fileBytes, normalizedContentType, Path.GetFileName(fileName));
    }

    // === Kategori Endpoint'leri ===

    /// <summary>
    /// Protokol kategorilerini listele
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProtocolCategoryDto>>>> GetCategories()
    {
        var categories = await _protocolService.GetCategoriesAsync();
        return Ok(ApiResponse<IEnumerable<ProtocolCategoryDto>>.SuccessResponse(categories));
    }

    /// <summary>
    /// Yeni protokol kategorisi oluştur
    /// </summary>
    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<ProtocolCategoryDto>>> CreateCategory([FromBody] CreateProtocolCategoryRequest request)
    {
        var category = await _protocolService.CreateCategoryAsync(request.Name, request.Description);
        return Ok(ApiResponse<ProtocolCategoryDto>.SuccessResponse(category));
    }

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
    {
        try
        {
            await _protocolService.DeleteCategoryAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Kategori silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }
}

public class CreateProtocolCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
