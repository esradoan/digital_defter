using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class StorageLocationService : IStorageLocationService
{
    private readonly IRepository<StorageLocation> _repository;

    public StorageLocationService(IRepository<StorageLocation> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<StorageLocation>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<StorageLocation?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<StorageLocation> CreateAsync(StorageLocation storageLocation)
    {
        storageLocation.CreatedAt = DateTime.UtcNow;

        return await _repository.AddAsync(storageLocation);
    }

    public async Task UpdateAsync(StorageLocation storageLocation)
    {
        var existing = await _repository.GetByIdAsync(storageLocation.Id);
        if (existing == null) throw new Exception("Depolama birimi bulunamadı!");

        existing.Name = storageLocation.Name;
        existing.Type = storageLocation.Type;
        existing.Description = storageLocation.Description;
        existing.TemperatureCondition = storageLocation.TemperatureCondition;
        existing.CapacityInfo = storageLocation.CapacityInfo;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing != null)
        {
            await _repository.DeleteAsync(existing);
        }
    }
}
