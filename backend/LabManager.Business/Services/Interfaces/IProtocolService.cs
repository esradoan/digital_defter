using LabManager.Business.DTOs.Protocol;

namespace LabManager.Business.Services.Interfaces;

public interface IProtocolService
{
    Task<IEnumerable<ProtocolDto>> GetAllAsync();
    Task<ProtocolDto?> GetByIdAsync(int id);
    Task<ProtocolDto> CreateAsync(string title, string? description, string fileName, string filePath, string contentType, long fileSize, int? protocolCategoryId);
    Task DeleteAsync(int id);
    Task<(string FilePath, string FileName, string ContentType)?> GetFileInfoAsync(int id);

    // Kategori işlemleri
    Task<IEnumerable<ProtocolCategoryDto>> GetCategoriesAsync();
    Task<ProtocolCategoryDto> CreateCategoryAsync(string name, string? description = null);
    Task DeleteCategoryAsync(int id);
}
