using System.ComponentModel.DataAnnotations;

namespace LabManager.Business.DTOs.Auth;

public class LoginDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur")]
    public string Password { get; set; } = string.Empty;
}

