using LabManager.Business.DTOs.Category;

namespace LabManager.Business.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> CreateAsync(string name, string? description = null, string? icon = null);
}

