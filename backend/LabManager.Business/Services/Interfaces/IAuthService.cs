using LabManager.Business.DTOs.Auth;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<User?> RegisterAsync(RegisterDto dto);
    string GenerateJwtToken(User user);
    Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<string?> UploadProfilePictureAsync(int userId, System.IO.Stream fileStream, string fileName);
}

