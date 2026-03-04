using LabManager.Business.DTOs.Device;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class DeviceService : IDeviceService
{
    private readonly IRepository<Device> _deviceRepository;
    private readonly IRepository<DeviceCategory> _deviceCategoryRepository;

    public DeviceService(
        IRepository<Device> deviceRepository,
        IRepository<DeviceCategory> deviceCategoryRepository)
    {
        _deviceRepository = deviceRepository;
        _deviceCategoryRepository = deviceCategoryRepository;
    }

    public async Task<IEnumerable<DeviceDto>> GetAllAsync()
    {
        var devices = await _deviceRepository.GetAllAsync();
        var categories = await _deviceCategoryRepository.GetAllAsync();
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        return devices.Select(d => new DeviceDto
        {
            Id = d.Id,
            Name = d.Name,
            BrandModel = d.BrandModel,
            Description = d.Description,
            DeviceCategoryId = d.DeviceCategoryId,
            CategoryName = d.DeviceCategoryId.HasValue && categoryDict.ContainsKey(d.DeviceCategoryId.Value)
                ? categoryDict[d.DeviceCategoryId.Value] : null,
            CreatedAt = d.CreatedAt
        }).OrderByDescending(d => d.CreatedAt);
    }

    public async Task<DeviceDto> CreateAsync(CreateDeviceDto dto)
    {
        var device = new Device
        {
            Name = dto.Name,
            BrandModel = dto.BrandModel,
            Description = dto.Description,
            DeviceCategoryId = dto.DeviceCategoryId
        };

        var created = await _deviceRepository.AddAsync(device);

        string? categoryName = null;
        if (dto.DeviceCategoryId.HasValue)
        {
            var cat = await _deviceCategoryRepository.GetByIdAsync(dto.DeviceCategoryId.Value);
            categoryName = cat?.Name;
        }

        return new DeviceDto
        {
            Id = created.Id,
            Name = created.Name,
            BrandModel = created.BrandModel,
            Description = created.Description,
            DeviceCategoryId = created.DeviceCategoryId,
            CategoryName = categoryName,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task<DeviceDto> UpdateAsync(int id, CreateDeviceDto dto)
    {
        var device = await _deviceRepository.GetByIdAsync(id);
        if (device == null) throw new Exception("Cihaz bulunamadı");

        device.Name = dto.Name;
        device.BrandModel = dto.BrandModel;
        device.Description = dto.Description;
        device.DeviceCategoryId = dto.DeviceCategoryId;

        await _deviceRepository.UpdateAsync(device);

        string? categoryName = null;
        if (dto.DeviceCategoryId.HasValue)
        {
            var cat = await _deviceCategoryRepository.GetByIdAsync(dto.DeviceCategoryId.Value);
            categoryName = cat?.Name;
        }

        return new DeviceDto
        {
            Id = device.Id,
            Name = device.Name,
            BrandModel = device.BrandModel,
            Description = device.Description,
            DeviceCategoryId = device.DeviceCategoryId,
            CategoryName = categoryName,
            CreatedAt = device.CreatedAt
        };
    }

    public async Task DeleteAsync(int id)
    {
        var device = await _deviceRepository.GetByIdAsync(id);
        if (device == null) throw new Exception("Cihaz bulunamadı");
        await _deviceRepository.DeleteAsync(device);
    }

    // === Kategori İşlemleri ===

    public async Task<IEnumerable<DeviceCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _deviceCategoryRepository.GetAllAsync();
        var devices = await _deviceRepository.GetAllAsync();

        return categories.Select(c => new DeviceCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            DeviceCount = devices.Count(d => d.DeviceCategoryId == c.Id)
        });
    }

    public async Task<DeviceCategoryDto> CreateCategoryAsync(string name, string? description = null)
    {
        var category = new DeviceCategory { Name = name, Description = description };
        var created = await _deviceCategoryRepository.AddAsync(category);

        return new DeviceCategoryDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            DeviceCount = 0
        };
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _deviceCategoryRepository.GetByIdAsync(id);
        if (category == null) throw new Exception("Kategori bulunamadı");
        await _deviceCategoryRepository.DeleteAsync(category);
    }
}
