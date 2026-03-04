using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Warehouse;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WarehousesController : ControllerBase
{
    private readonly IWarehouseService _warehouseService;

    public WarehousesController(IWarehouseService warehouseService)
    {
        _warehouseService = warehouseService;
    }

    // === Depo Endpoint'leri ===

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<WarehouseDto>>>> GetAll()
    {
        var warehouses = await _warehouseService.GetAllWarehousesAsync();
        return Ok(ApiResponse<IEnumerable<WarehouseDto>>.SuccessResponse(warehouses));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<WarehouseDto>>> Create([FromBody] CreateWarehouseDto dto)
    {
        var warehouse = await _warehouseService.CreateWarehouseAsync(dto);
        return Ok(ApiResponse<WarehouseDto>.SuccessResponse(warehouse, "Depo oluşturuldu"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<WarehouseDto>>> Update(int id, [FromBody] CreateWarehouseDto dto)
    {
        try
        {
            var warehouse = await _warehouseService.UpdateWarehouseAsync(id, dto);
            return Ok(ApiResponse<WarehouseDto>.SuccessResponse(warehouse, "Depo güncellendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<WarehouseDto>.ErrorResponse(ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            await _warehouseService.DeleteWarehouseAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Depo silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }

    // === Depo Ürünleri ===

    [HttpGet("{warehouseId}/items")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WarehouseItemDto>>>> GetItems(int warehouseId)
    {
        var items = await _warehouseService.GetItemsByWarehouseAsync(warehouseId);
        return Ok(ApiResponse<IEnumerable<WarehouseItemDto>>.SuccessResponse(items));
    }

    [HttpPost("items")]
    public async Task<ActionResult<ApiResponse<WarehouseItemDto>>> CreateItem([FromBody] CreateWarehouseItemDto dto)
    {
        try
        {
            var item = await _warehouseService.CreateItemAsync(dto);
            return Ok(ApiResponse<WarehouseItemDto>.SuccessResponse(item, "Ürün eklendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<WarehouseItemDto>.ErrorResponse(ex.Message));
        }
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<ApiResponse<WarehouseItemDto>>> UpdateItem(int id, [FromBody] CreateWarehouseItemDto dto)
    {
        try
        {
            var item = await _warehouseService.UpdateItemAsync(id, dto);
            return Ok(ApiResponse<WarehouseItemDto>.SuccessResponse(item, "Ürün güncellendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<WarehouseItemDto>.ErrorResponse(ex.Message));
        }
    }

    [HttpDelete("items/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteItem(int id)
    {
        try
        {
            await _warehouseService.DeleteItemAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Ürün silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }

    // === Kategoriler ===

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WarehouseCategoryDto>>>> GetCategories()
    {
        var categories = await _warehouseService.GetCategoriesAsync();
        return Ok(ApiResponse<IEnumerable<WarehouseCategoryDto>>.SuccessResponse(categories));
    }

    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<WarehouseCategoryDto>>> CreateCategory([FromBody] CreateCategoryReq request)
    {
        var category = await _warehouseService.CreateCategoryAsync(request.Name, request.Description);
        return Ok(ApiResponse<WarehouseCategoryDto>.SuccessResponse(category));
    }

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
    {
        try
        {
            await _warehouseService.DeleteCategoryAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Kategori silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }
}

public class CreateCategoryReq
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
