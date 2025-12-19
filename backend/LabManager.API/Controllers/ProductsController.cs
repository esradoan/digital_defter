using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Product;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Tüm endpoint'ler için authentication zorunlu
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>
    /// Tüm ürünleri getir
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<ProductDto>>.SuccessResponse(products));
    }

    /// <summary>
    /// Id'ye göre ürün getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound(ApiResponse<ProductDto>.ErrorResponse("Ürün bulunamadı"));
        }

        return Ok(ApiResponse<ProductDto>.SuccessResponse(product));
    }

    /// <summary>
    /// Yeni ürün ekle
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDto>>> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<ProductDto>.ErrorResponse("Geçersiz veri"));
        }

        try
        {
            var product = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id },
                ApiResponse<ProductDto>.SuccessResponse(product, "Ürün başarıyla oluşturuldu"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ProductDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Ürün güncelle
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> Update(int id, [FromBody] UpdateProductDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest(ApiResponse<ProductDto>.ErrorResponse("Id uyumsuzluğu"));
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<ProductDto>.ErrorResponse("Geçersiz veri"));
        }

        try
        {
            var product = await _productService.UpdateAsync(dto);
            return Ok(ApiResponse<ProductDto>.SuccessResponse(product, "Ürün başarıyla güncellendi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ProductDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Ürün sil
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        try
        {
            await _productService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(true, "Ürün başarıyla silindi"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Düşük stoklu ürünler
    /// </summary>
    [HttpGet("low-stock")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetLowStock()
    {
        var products = await _productService.GetLowStockProductsAsync();
        return Ok(ApiResponse<IEnumerable<ProductDto>>.SuccessResponse(products));
    }

    /// <summary>
    /// Son kullanma tarihi yaklaşan ürünler
    /// </summary>
    [HttpGet("expiring-soon")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetExpiringSoon([FromQuery] int days = 30)
    {
        var products = await _productService.GetExpiringSoonProductsAsync(days);
        return Ok(ApiResponse<IEnumerable<ProductDto>>.SuccessResponse(products));
    }

    /// <summary>
    /// Kategoriye göre ürünler
    /// </summary>
    [HttpGet("by-category/{categoryId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetByCategory(int categoryId)
    {
        var products = await _productService.GetByCategoryAsync(categoryId);
        return Ok(ApiResponse<IEnumerable<ProductDto>>.SuccessResponse(products));
    }

    /// <summary>
    /// Toplam ürün sayısı
    /// </summary>
    [HttpGet("count")]
    public async Task<ActionResult<ApiResponse<int>>> GetCount()
    {
        var count = await _productService.GetTotalCountAsync();
        return Ok(ApiResponse<int>.SuccessResponse(count));
    }
}

