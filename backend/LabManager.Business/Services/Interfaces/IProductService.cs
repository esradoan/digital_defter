using LabManager.Business.DTOs.Product;

namespace LabManager.Business.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto> UpdateAsync(UpdateProductDto dto);
    Task DeleteAsync(int id);
    
    // Özel metodlar
    Task<IEnumerable<ProductDto>> GetLowStockProductsAsync();
    Task<IEnumerable<ProductDto>> GetExpiringSoonProductsAsync(int days = 30);
    Task<IEnumerable<ProductDto>> GetByCategoryAsync(int categoryId);
    Task<int> GetTotalCountAsync();
}

