using LabManager.Business.DTOs.Auth;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<User?> RegisterAsync(RegisterDto dto);
    string GenerateJwtToken(User user);
}

