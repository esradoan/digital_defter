using LabManager.Business.DTOs.Device;

namespace LabManager.Business.Services.Interfaces;

public interface IDeviceService
{
    Task<IEnumerable<DeviceDto>> GetAllAsync();
    Task<DeviceDto> CreateAsync(CreateDeviceDto dto);
    Task<DeviceDto> UpdateAsync(int id, CreateDeviceDto dto);
    Task DeleteAsync(int id);

    // Kategori işlemleri
    Task<IEnumerable<DeviceCategoryDto>> GetCategoriesAsync();
    Task<DeviceCategoryDto> CreateCategoryAsync(string name, string? description = null);
    Task DeleteCategoryAsync(int id);
}
