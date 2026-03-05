using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LabManager.Business.DTOs.Common;
using LabManager.Business.DTOs.User;
using LabManager.Business.Services.Interfaces;

namespace LabManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Tüm kullanıcıları listele (Admin only)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<IEnumerable<UserDto>>.SuccessResponse(users));
    }

    /// <summary>
    /// Kullanıcıyı onayla (Admin only)
    /// </summary>
    [HttpPut("{id}/approve")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Approve(int id)
    {
        var user = await _userService.ApproveUserAsync(id);
        if (user == null)
        {
            return NotFound(ApiResponse<UserDto>.ErrorResponse("Kullanıcı bulunamadı"));
        }
        return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Kullanıcı onaylandı"));
    }

    /// <summary>
    /// Kullanıcıyı sil/reddet (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
    {
        try
        {
            await _userService.DeleteUserAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Kullanıcı silindi"));
        }
        catch (Exception ex)
        {
            return NotFound(ApiResponse<string>.ErrorResponse(ex.Message));
        }
    }
}
