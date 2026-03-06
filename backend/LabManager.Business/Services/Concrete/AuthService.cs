using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using LabManager.Business.DTOs.Auth;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;
using LabManager.Entity.Enums;

namespace LabManager.Business.Services.Concrete;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IRepository<User> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        // Kullanıcıyı bul
        var users = await _userRepository.FindAsync(u => u.Username == dto.Username);
        var user = users.FirstOrDefault();

        if (user == null)
            return null;

        // Şifre kontrolü (BCrypt)
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        // Onay kontrolü — Admin her zaman girebilir
        if (!user.IsApproved && user.Role != UserRole.Admin)
        {
            throw new UnauthorizedAccessException("Hesabınız henüz yönetici tarafından onaylanmadı. Onaylandıktan sonra giriş yapabilirsiniz.");
        }

        // Son login tarihini güncelle
        user.LastLogin = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Token oluştur
        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            ProfileImageUrl = user.ProfileImageUrl
        };
    }

    public async Task<User?> RegisterAsync(RegisterDto dto)
    {
        // Username veya Email zaten var mı kontrol et
        var existingUser = await _userRepository.ExistsAsync(u => 
            u.Username == dto.Username || u.Email == dto.Email);

        if (existingUser)
            return null;

        // Yeni kullanıcı oluştur — onay bekleyecek
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName,
            Role = UserRole.Student, // Varsayılan rol: Öğrenci
            IsApproved = false, // Yönetici onayı gerekli
            CreatedAt = DateTime.UtcNow
        };

        return await _userRepository.AddAsync(user);
    }

    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new Exception("JWT SecretKey bulunamadı");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("FullName", user.FullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(jwtSettings["ExpirationMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        // E-posta başkası tarafından kullanılıyor mu kontrol et
        var emailExists = await _userRepository.ExistsAsync(u => u.Email == dto.Email && u.Id != userId);
        if (emailExists) return false;

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        // Eski şifre doğru mu?
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<string?> UploadProfilePictureAsync(int userId, Stream fileStream, string fileName)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        if (fileStream == null || fileStream.Length == 0) return null;

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // Eski PP varsa sil
        if (!string.IsNullOrEmpty(user.ProfileImageUrl))
        {
            var oldFileName = Path.GetFileName(user.ProfileImageUrl);
            var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
            if (File.Exists(oldFilePath))
            {
                File.Delete(oldFilePath);
            }
        }

        // Yeni PP oluştur
        var fileExtension = Path.GetExtension(fileName);
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var destStream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(destStream);
        }

        user.ProfileImageUrl = $"/uploads/profiles/{uniqueFileName}";
        await _userRepository.UpdateAsync(user);

        return user.ProfileImageUrl;
    }
}

