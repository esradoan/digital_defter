using LabManager.Business.DTOs.Protocol;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;

namespace LabManager.Business.Services.Concrete;

public class ProtocolService : IProtocolService
{
    private readonly IRepository<Protocol> _protocolRepository;
    private readonly IRepository<ProtocolCategory> _protocolCategoryRepository;

    public ProtocolService(
        IRepository<Protocol> protocolRepository,
        IRepository<ProtocolCategory> protocolCategoryRepository)
    {
        _protocolRepository = protocolRepository;
        _protocolCategoryRepository = protocolCategoryRepository;
    }

    public async Task<IEnumerable<ProtocolDto>> GetAllAsync()
    {
        var protocols = await _protocolRepository.GetAllAsync();
        var categories = await _protocolCategoryRepository.GetAllAsync();
        var categoryDict = categories.ToDictionary(c => c.Id, c => c.Name);

        return protocols.Select(p => new ProtocolDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            FileName = p.FileName,
            ContentType = p.ContentType,
            FileSize = p.FileSize,
            ProtocolCategoryId = p.ProtocolCategoryId,
            CategoryName = p.ProtocolCategoryId.HasValue && categoryDict.ContainsKey(p.ProtocolCategoryId.Value)
                ? categoryDict[p.ProtocolCategoryId.Value]
                : null,
            CreatedAt = p.CreatedAt
        }).OrderByDescending(p => p.CreatedAt);
    }

    public async Task<ProtocolDto?> GetByIdAsync(int id)
    {
        var protocol = await _protocolRepository.GetByIdAsync(id);
        if (protocol == null) return null;

        string? categoryName = null;
        if (protocol.ProtocolCategoryId.HasValue)
        {
            var category = await _protocolCategoryRepository.GetByIdAsync(protocol.ProtocolCategoryId.Value);
            categoryName = category?.Name;
        }

        return new ProtocolDto
        {
            Id = protocol.Id,
            Title = protocol.Title,
            Description = protocol.Description,
            FileName = protocol.FileName,
            ContentType = protocol.ContentType,
            FileSize = protocol.FileSize,
            ProtocolCategoryId = protocol.ProtocolCategoryId,
            CategoryName = categoryName,
            CreatedAt = protocol.CreatedAt
        };
    }

    public async Task<ProtocolDto> CreateAsync(string title, string? description, string fileName, string filePath, string contentType, long fileSize, int? protocolCategoryId)
    {
        var protocol = new Protocol
        {
            Title = title,
            Description = description,
            FileName = fileName,
            FilePath = filePath,
            ContentType = contentType,
            FileSize = fileSize,
            ProtocolCategoryId = protocolCategoryId
        };

        var created = await _protocolRepository.AddAsync(protocol);

        string? categoryName = null;
        if (protocolCategoryId.HasValue)
        {
            var category = await _protocolCategoryRepository.GetByIdAsync(protocolCategoryId.Value);
            categoryName = category?.Name;
        }

        return new ProtocolDto
        {
            Id = created.Id,
            Title = created.Title,
            Description = created.Description,
            FileName = created.FileName,
            ContentType = created.ContentType,
            FileSize = created.FileSize,
            ProtocolCategoryId = created.ProtocolCategoryId,
            CategoryName = categoryName,
            CreatedAt = created.CreatedAt
        };
    }

    public async Task DeleteAsync(int id)
    {
        var protocol = await _protocolRepository.GetByIdAsync(id);
        if (protocol == null)
            throw new Exception("Protokol bulunamadı");

        // Dosyayı sil
        if (File.Exists(protocol.FilePath))
        {
            File.Delete(protocol.FilePath);
        }

        await _protocolRepository.DeleteAsync(protocol);
    }

    public async Task<(string FilePath, string FileName, string ContentType)?> GetFileInfoAsync(int id)
    {
        var protocol = await _protocolRepository.GetByIdAsync(id);
        if (protocol == null) return null;

        return (protocol.FilePath, protocol.FileName, protocol.ContentType);
    }

    // === Kategori İşlemleri ===

    public async Task<IEnumerable<ProtocolCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _protocolCategoryRepository.GetAllAsync();
        var protocols = await _protocolRepository.GetAllAsync();

        return categories.Select(c => new ProtocolCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            ProtocolCount = protocols.Count(p => p.ProtocolCategoryId == c.Id)
        });
    }

    public async Task<ProtocolCategoryDto> CreateCategoryAsync(string name, string? description = null)
    {
        var category = new ProtocolCategory
        {
            Name = name,
            Description = description
        };

        var created = await _protocolCategoryRepository.AddAsync(category);

        return new ProtocolCategoryDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            ProtocolCount = 0
        };
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _protocolCategoryRepository.GetByIdAsync(id);
        if (category == null) throw new Exception("Kategori bulunamadı");
        await _protocolCategoryRepository.DeleteAsync(category);
    }
}
