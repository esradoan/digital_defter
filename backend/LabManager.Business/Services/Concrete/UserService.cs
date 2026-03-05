using LabManager.Business.DTOs.User;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;

    public UserService(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToDto);
    }

    public async Task<UserDto?> ApproveUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return null;

        user.IsApproved = true;
        await _userRepository.UpdateAsync(user);
        return MapToDto(user);
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new Exception("Kullanıcı bulunamadı");

        await _userRepository.DeleteAsync(user);
    }

    private UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        FullName = user.FullName,
        Role = user.Role.ToString(),
        IsApproved = user.IsApproved,
        CreatedAt = user.CreatedAt,
        LastLogin = user.LastLogin
    };
}
