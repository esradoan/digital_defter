using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Device;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly IDeviceService _deviceService;

    public DevicesController(IDeviceService deviceService)
    {
        _deviceService = deviceService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<DeviceDto>>>> GetAll()
    {
        var devices = await _deviceService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<DeviceDto>>.SuccessResponse(devices));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<DeviceDto>>> Create([FromBody] CreateDeviceDto dto)
    {
        try
        {
            var device = await _deviceService.CreateAsync(dto);
            return Ok(ApiResponse<DeviceDto>.SuccessResponse(device, "Cihaz başarıyla eklendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<DeviceDto>.ErrorResponse(ex.Message));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<DeviceDto>>> Update(int id, [FromBody] CreateDeviceDto dto)
    {
        try
        {
            var device = await _deviceService.UpdateAsync(id, dto);
            return Ok(ApiResponse<DeviceDto>.SuccessResponse(device, "Cihaz güncellendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<DeviceDto>.ErrorResponse(ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            await _deviceService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Cihaz silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }

    // === Kategori Endpoint'leri ===

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<DeviceCategoryDto>>>> GetCategories()
    {
        var categories = await _deviceService.GetCategoriesAsync();
        return Ok(ApiResponse<IEnumerable<DeviceCategoryDto>>.SuccessResponse(categories));
    }

    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<DeviceCategoryDto>>> CreateCategory([FromBody] CreateDeviceCategoryRequest request)
    {
        var category = await _deviceService.CreateCategoryAsync(request.Name, request.Description);
        return Ok(ApiResponse<DeviceCategoryDto>.SuccessResponse(category));
    }

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
    {
        try
        {
            await _deviceService.DeleteCategoryAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Kategori silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }
}

public class CreateDeviceCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
