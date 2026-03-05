using LabManager.Business.DTOs.User;

namespace LabManager.Business.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> ApproveUserAsync(int id);
    Task DeleteUserAsync(int id);
}
