using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Interfaces;

public interface IStorageLocationService
{
    Task<IEnumerable<StorageLocation>> GetAllAsync();
    Task<StorageLocation?> GetByIdAsync(int id);
    Task<StorageLocation> CreateAsync(StorageLocation storageLocation);
    Task UpdateAsync(StorageLocation storageLocation);
    Task DeleteAsync(int id);
}
