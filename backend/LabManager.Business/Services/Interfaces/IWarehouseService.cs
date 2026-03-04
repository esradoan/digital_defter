using LabManager.Business.DTOs.Warehouse;

namespace LabManager.Business.Services.Interfaces;

public interface IWarehouseService
{
    // Depo CRUD
    Task<IEnumerable<WarehouseDto>> GetAllWarehousesAsync();
    Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto);
    Task<WarehouseDto> UpdateWarehouseAsync(int id, CreateWarehouseDto dto);
    Task DeleteWarehouseAsync(int id);

    // Depo ürünleri
    Task<IEnumerable<WarehouseItemDto>> GetItemsByWarehouseAsync(int warehouseId);
    Task<WarehouseItemDto> CreateItemAsync(CreateWarehouseItemDto dto);
    Task<WarehouseItemDto> UpdateItemAsync(int id, CreateWarehouseItemDto dto);
    Task DeleteItemAsync(int id);

    // Kategoriler
    Task<IEnumerable<WarehouseCategoryDto>> GetCategoriesAsync();
    Task<WarehouseCategoryDto> CreateCategoryAsync(string name, string? description = null);
    Task DeleteCategoryAsync(int id);
}
