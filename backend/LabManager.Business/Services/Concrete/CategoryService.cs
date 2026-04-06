using LabManager.Business.DTOs.Category;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class CategoryService : ICategoryService
{
    private readonly IRepository<Category> _categoryRepository;
    private readonly IRepository<Product> _productRepository;

    public CategoryService(
        IRepository<Category> categoryRepository,
        IRepository<Product> productRepository)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        var categoryDtos = new List<CategoryDto>();

        foreach (var category in categories)
        {
            var productCount = await _productRepository.CountAsync(p => p.CategoryId == category.Id);
            
            categoryDtos.Add(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Icon = category.Icon,
                ProductCount = productCount
            });
        }

        return categoryDtos;
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            return null;

        var productCount = await _productRepository.CountAsync(p => p.CategoryId == category.Id);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Icon = category.Icon,
            ProductCount = productCount
        };
    }

    public async Task<CategoryDto> CreateAsync(string name, string? description = null, string? icon = null)
    {
        var category = new Category
        {
            Name = name,
            Description = description,
            Icon = icon
        };

        var created = await _categoryRepository.AddAsync(category);

        return new CategoryDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            Icon = created.Icon,
            ProductCount = 0
        };
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            throw new Exception("Kategori bulunamadı");

        var products = await _productRepository.FindAsync(p => p.CategoryId == id);
        foreach (var product in products)
            await _productRepository.DeleteAsync(product);

        await _categoryRepository.DeleteAsync(category);
    }
}

