using LabManager.Business.DTOs.Warehouse;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class WarehouseService : IWarehouseService
{
    private readonly IRepository<Warehouse> _warehouseRepo;
    private readonly IRepository<WarehouseItem> _itemRepo;
    private readonly IRepository<WarehouseCategory> _categoryRepo;

    public WarehouseService(
        IRepository<Warehouse> warehouseRepo,
        IRepository<WarehouseItem> itemRepo,
        IRepository<WarehouseCategory> categoryRepo)
    {
        _warehouseRepo = warehouseRepo;
        _itemRepo = itemRepo;
        _categoryRepo = categoryRepo;
    }

    // === Depo CRUD ===

    public async Task<IEnumerable<WarehouseDto>> GetAllWarehousesAsync()
    {
        var warehouses = await _warehouseRepo.GetAllAsync();
        var allItems = await _itemRepo.GetAllAsync();

        return warehouses.Select(w => new WarehouseDto
        {
            Id = w.Id,
            Name = w.Name,
            Description = w.Description,
            Location = w.Location,
            ItemCount = allItems.Count(i => i.WarehouseId == w.Id),
            CreatedAt = w.CreatedAt
        }).OrderByDescending(w => w.CreatedAt);
    }

    public async Task<WarehouseDto> CreateWarehouseAsync(CreateWarehouseDto dto)
    {
        var warehouse = new Warehouse
        {
            Name = dto.Name,
            Description = dto.Description,
            Location = dto.Location
        };
        var created = await _warehouseRepo.AddAsync(warehouse);
        return new WarehouseDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            Location = created.Location,
            ItemCount = 0,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task<WarehouseDto> UpdateWarehouseAsync(int id, CreateWarehouseDto dto)
    {
        var warehouse = await _warehouseRepo.GetByIdAsync(id)
            ?? throw new Exception("Depo bulunamadı");
        warehouse.Name = dto.Name;
        warehouse.Description = dto.Description;
        warehouse.Location = dto.Location;
        await _warehouseRepo.UpdateAsync(warehouse);

        var allItems = await _itemRepo.GetAllAsync();
        return new WarehouseDto
        {
            Id = warehouse.Id,
            Name = warehouse.Name,
            Description = warehouse.Description,
            Location = warehouse.Location,
            ItemCount = allItems.Count(i => i.WarehouseId == warehouse.Id),
            CreatedAt = warehouse.CreatedAt
        };
    }

    public async Task DeleteWarehouseAsync(int id)
    {
        var warehouse = await _warehouseRepo.GetByIdAsync(id)
            ?? throw new Exception("Depo bulunamadı");
        await _warehouseRepo.DeleteAsync(warehouse);
    }

    // === Depo Ürünleri ===

    public async Task<IEnumerable<WarehouseItemDto>> GetItemsByWarehouseAsync(int warehouseId)
    {
        var allItems = await _itemRepo.GetAllAsync();
        var categories = await _categoryRepo.GetAllAsync();
        var catDict = categories.ToDictionary(c => c.Id, c => c.Name);

        return allItems
            .Where(i => i.WarehouseId == warehouseId)
            .Select(i => new WarehouseItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Quantity = i.Quantity,
                Unit = i.Unit,
                Description = i.Description,
                WarehouseId = i.WarehouseId,
                WarehouseCategoryId = i.WarehouseCategoryId,
                CategoryName = i.WarehouseCategoryId.HasValue && catDict.ContainsKey(i.WarehouseCategoryId.Value)
                    ? catDict[i.WarehouseCategoryId.Value] : null,
                CreatedAt = i.CreatedAt
            })
            .OrderByDescending(i => i.CreatedAt);
    }

    public async Task<WarehouseItemDto> CreateItemAsync(CreateWarehouseItemDto dto)
    {
        var item = new WarehouseItem
        {
            Name = dto.Name,
            Quantity = dto.Quantity,
            Unit = dto.Unit,
            Description = dto.Description,
            WarehouseId = dto.WarehouseId,
            WarehouseCategoryId = dto.WarehouseCategoryId
        };
        var created = await _itemRepo.AddAsync(item);

        string? catName = null;
        if (dto.WarehouseCategoryId.HasValue)
        {
            var cat = await _categoryRepo.GetByIdAsync(dto.WarehouseCategoryId.Value);
            catName = cat?.Name;
        }

        return new WarehouseItemDto
        {
            Id = created.Id,
            Name = created.Name,
            Quantity = created.Quantity,
            Unit = created.Unit,
            Description = created.Description,
            WarehouseId = created.WarehouseId,
            WarehouseCategoryId = created.WarehouseCategoryId,
            CategoryName = catName,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task<WarehouseItemDto> UpdateItemAsync(int id, CreateWarehouseItemDto dto)
    {
        var item = await _itemRepo.GetByIdAsync(id)
            ?? throw new Exception("Ürün bulunamadı");
        item.Name = dto.Name;
        item.Quantity = dto.Quantity;
        item.Unit = dto.Unit;
        item.Description = dto.Description;
        item.WarehouseCategoryId = dto.WarehouseCategoryId;
        await _itemRepo.UpdateAsync(item);

        string? catName = null;
        if (dto.WarehouseCategoryId.HasValue)
        {
            var cat = await _categoryRepo.GetByIdAsync(dto.WarehouseCategoryId.Value);
            catName = cat?.Name;
        }

        return new WarehouseItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Quantity = item.Quantity,
            Unit = item.Unit,
            Description = item.Description,
            WarehouseId = item.WarehouseId,
            WarehouseCategoryId = item.WarehouseCategoryId,
            CategoryName = catName,
            CreatedAt = item.CreatedAt
        };
    }

    public async Task DeleteItemAsync(int id)
    {
        var item = await _itemRepo.GetByIdAsync(id)
            ?? throw new Exception("Ürün bulunamadı");
        await _itemRepo.DeleteAsync(item);
    }

    // === Kategoriler ===

    public async Task<IEnumerable<WarehouseCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepo.GetAllAsync();
        var allItems = await _itemRepo.GetAllAsync();

        return categories.Select(c => new WarehouseCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ItemCount = allItems.Count(i => i.WarehouseCategoryId == c.Id)
        });
    }

    public async Task<WarehouseCategoryDto> CreateCategoryAsync(string name, string? description = null)
    {
        var category = new WarehouseCategory { Name = name, Description = description };
        var created = await _categoryRepo.AddAsync(category);
        return new WarehouseCategoryDto { Id = created.Id, Name = created.Name, Description = created.Description, ItemCount = 0 };
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepo.GetByIdAsync(id)
            ?? throw new Exception("Kategori bulunamadı");
        await _categoryRepo.DeleteAsync(category);
    }
}
