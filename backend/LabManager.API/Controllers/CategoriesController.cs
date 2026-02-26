using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Category;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Tüm kategorileri getir
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CategoryDto>>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<CategoryDto>>.SuccessResponse(categories));
    }

    /// <summary>
    /// Id'ye göre kategori getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(ApiResponse<CategoryDto>.ErrorResponse("Kategori bulunamadı"));
        }

        return Ok(ApiResponse<CategoryDto>.SuccessResponse(category));
    }

    /// <summary>
    /// Yeni kategori oluştur
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> Create([FromBody] CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateAsync(request.Name, request.Description, request.Icon);
        return Ok(ApiResponse<CategoryDto>.SuccessResponse(category));
    }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
}

