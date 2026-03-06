using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
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

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");
        return userId;
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

        try
        {
            var response = await _authService.LoginAsync(dto);

            if (response == null)
            {
                return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse("Kullanıcı adı veya şifre hatalı"));
            }

            return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(response, "Giriş başarılı"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<LoginResponseDto>.ErrorResponse(ex.Message));
        }
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

        return Ok(ApiResponse<string>.SuccessResponse("Hesabınız oluşturuldu! Yönetici onayından sonra giriş yapabilirsiniz.", "Kayıt başarılı"));
    }

    /// <summary>
    /// Profil bilgilerini (ad, e-posta) güncelle
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.ErrorResponse("Geçersiz veri"));

        var userId = GetUserId();
        var success = await _authService.UpdateProfileAsync(userId, dto);

        if (!success)
            return BadRequest(ApiResponse<string>.ErrorResponse("Profil güncellenemedi veya e-posta başkası tarafından kullanılıyor"));

        return Ok(ApiResponse<string>.SuccessResponse("Profil başarıyla güncellendi"));
    }

    /// <summary>
    /// Kullanıcı şifresini değiştir
    /// </summary>
    [HttpPut("password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.ErrorResponse("Geçersiz veri"));

        var userId = GetUserId();
        var success = await _authService.ChangePasswordAsync(userId, dto);

        if (!success)
            return BadRequest(ApiResponse<string>.ErrorResponse("Şifre güncellenemedi. Mevcut şifrenizi doğru girdiğinizden emin olun."));

        return Ok(ApiResponse<string>.SuccessResponse("Şifre başarıyla güncellendi"));
    }

    /// <summary>
    /// Kullanıcı profil fotoğrafı yükle
    /// </summary>
    [HttpPost("profile-picture")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> UploadProfilePicture(Microsoft.AspNetCore.Http.IFormFile file)
    {
        var userId = GetUserId();
        using var stream = file.OpenReadStream();
        var imageUrl = await _authService.UploadProfilePictureAsync(userId, stream, file.FileName);

        if (imageUrl == null)
            return BadRequest(ApiResponse<string>.ErrorResponse("Fotoğraf yüklenemedi."));

        return Ok(ApiResponse<string>.SuccessResponse(imageUrl, "Profil fotoğrafı başarıyla yüklendi"));
    }
}

