using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Auth;
using LabManager.Business.DTOs.Common;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Kullanıcı girişi
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<LoginResponseDto>.ErrorResponse("Geçersiz veri"));
        }

        var response = await _authService.LoginAsync(dto);

        if (response == null)
        {
            return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse("Kullanıcı adı veya şifre hatalı"));
        }

        return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(response, "Giriş başarılı"));
    }

    /// <summary>
    /// Yeni kullanıcı kaydı
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<string>>> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Geçersiz veri"));
        }

        var user = await _authService.RegisterAsync(dto);

        if (user == null)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Kullanıcı adı veya email zaten kullanılıyor"));
        }

        return Ok(ApiResponse<string>.SuccessResponse("Kullanıcı başarıyla oluşturuldu", "Kayıt başarılı"));
    }
}

