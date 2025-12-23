using LabManager.Business.DTOs.Product;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _productRepository;
    private readonly IRepository<Category> _categoryRepository;
    private readonly IRepository<StorageLocation> _storageLocationRepository;

    public ProductService(
        IRepository<Product> productRepository,
        IRepository<Category> categoryRepository,
        IRepository<StorageLocation> storageLocationRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
        _storageLocationRepository = storageLocationRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        var productDtos = new List<ProductDto>();

        foreach (var product in products)
        {
            productDtos.Add(await MapToDto(product));
        }

        return productDtos;
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            return null;

        return await MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            SerialNumber = dto.SerialNumber, // Yeni eklendi
            CatalogNumber = dto.CatalogNumber,
            Brand = dto.Brand,
            LotNumber = dto.LotNumber,
            ExpiryDate = dto.ExpiryDate,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            MinStockLevel = dto.MinStockLevel,
            StorageCondition = dto.StorageCondition,
            StorageLocationId = dto.StorageLocationId,
            DetailedLocation = dto.DetailedLocation,
            OpeningDate = dto.OpeningDate,
            Notes = dto.Notes,
            Price = dto.Price,
            Supplier = dto.Supplier,
            CreatedAt = DateTime.UtcNow
        };

        var createdProduct = await _productRepository.AddAsync(product);
        return await MapToDto(createdProduct);
    }

    public async Task<ProductDto> UpdateAsync(UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.Id);
        if (product == null)
            throw new Exception("Ürün bulunamadı");

        product.Name = dto.Name;
        product.CategoryId = dto.CategoryId;
        product.SerialNumber = dto.SerialNumber;
        product.CatalogNumber = dto.CatalogNumber;
        product.Brand = dto.Brand;
        product.LotNumber = dto.LotNumber;
        product.ExpiryDate = dto.ExpiryDate;
        product.Quantity = dto.Quantity;
        product.Unit = dto.Unit;
        product.MinStockLevel = dto.MinStockLevel;
        product.StorageCondition = dto.StorageCondition;
        product.StorageLocationId = dto.StorageLocationId;
        product.DetailedLocation = dto.DetailedLocation;
        product.OpeningDate = dto.OpeningDate;
        product.Notes = dto.Notes;
        product.Price = dto.Price;
        product.Supplier = dto.Supplier;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
        return await MapToDto(product);
    }

    public async Task DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            throw new Exception("Ürün bulunamadı");

        await _productRepository.DeleteAsync(product);
    }

    public async Task<IEnumerable<ProductDto>> GetLowStockProductsAsync()
    {
        var products = await _productRepository.FindAsync(p => 
            p.MinStockLevel.HasValue && p.Quantity <= p.MinStockLevel.Value);
        
        var productDtos = new List<ProductDto>();
        foreach (var product in products)
        {
            productDtos.Add(await MapToDto(product));
        }

        return productDtos;
    }

    public async Task<IEnumerable<ProductDto>> GetExpiringSoonProductsAsync(int days = 30)
    {
        var expiryDate = DateTime.UtcNow.AddDays(days);
        var products = await _productRepository.FindAsync(p => 
            p.ExpiryDate.HasValue && p.ExpiryDate.Value <= expiryDate);
        
        var productDtos = new List<ProductDto>();
        foreach (var product in products)
        {
            productDtos.Add(await MapToDto(product));
        }

        return productDtos;
    }

    public async Task<IEnumerable<ProductDto>> GetByCategoryAsync(int categoryId)
    {
        var products = await _productRepository.FindAsync(p => p.CategoryId == categoryId);
        
        var productDtos = new List<ProductDto>();
        foreach (var product in products)
        {
            productDtos.Add(await MapToDto(product));
        }

        return productDtos;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _productRepository.CountAsync();
    }

    // Helper: Entity'den DTO'ya dönüşüm
    private async Task<ProductDto> MapToDto(Product product)
    {
        Category? category = null;
        if (product.CategoryId.HasValue)
        {
            category = await _categoryRepository.GetByIdAsync(product.CategoryId.Value);
        }

        StorageLocation? storageLocation = null;
        
        if (product.StorageLocationId.HasValue)
        {
            storageLocation = await _storageLocationRepository.GetByIdAsync(product.StorageLocationId.Value);
        }

        bool isLowStock = product.MinStockLevel.HasValue && product.Quantity <= product.MinStockLevel.Value;
        bool isExpiringSoon = product.ExpiryDate.HasValue && product.ExpiryDate.Value <= DateTime.UtcNow.AddDays(30);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name ?? string.Empty,
            CategoryId = product.CategoryId ?? 0,
            CategoryName = category?.Name ?? "Kategorisiz",
            SerialNumber = product.SerialNumber,
            CatalogNumber = product.CatalogNumber,
            Brand = product.Brand,
            LotNumber = product.LotNumber,
            ExpiryDate = product.ExpiryDate,
            Quantity = product.Quantity,
            Unit = product.Unit ?? string.Empty,
            MinStockLevel = product.MinStockLevel,
            StorageCondition = product.StorageCondition?.ToString() ?? string.Empty,
            StorageLocationId = product.StorageLocationId,
            StorageLocationName = storageLocation?.Name,
            DetailedLocation = product.DetailedLocation,
            OpeningDate = product.OpeningDate,
            Notes = product.Notes,
            Price = product.Price,
            Supplier = product.Supplier,
            CreatedAt = product.CreatedAt,
            IsLowStock = isLowStock,
            IsExpiringSoon = isExpiringSoon
        };
    }
}

