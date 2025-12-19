using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Category;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
}

