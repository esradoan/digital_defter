using System.ComponentModel.DataAnnotations;

namespace LabManager.Business.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Kullanıcı adı 3-100 karakter arası olmalıdır")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email zorunludur")]
    [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ad Soyad zorunludur")]
    public string FullName { get; set; } = string.Empty;
}

