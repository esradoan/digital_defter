using Microsoft.AspNetCore.Mvc;
using LabManager.Business.Services.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StorageLocationsController : ControllerBase
{
    private readonly IStorageLocationService _storageLocationService;

    public StorageLocationsController(IStorageLocationService storageLocationService)
    {
        _storageLocationService = storageLocationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var locations = await _storageLocationService.GetAllAsync();
        return Ok(locations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var location = await _storageLocationService.GetByIdAsync(id);
        if (location == null) return NotFound("Depolama birimi bulunamadı.");
        return Ok(location);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] StorageLocation storageLocation)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var created = await _storageLocationService.CreateAsync(storageLocation);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] StorageLocation storageLocation)
    {
        if (id != storageLocation.Id) return BadRequest("ID uyuşmazlığı.");

        try
        {
            await _storageLocationService.UpdateAsync(storageLocation);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _storageLocationService.DeleteAsync(id);
        return NoContent();
    }
}
