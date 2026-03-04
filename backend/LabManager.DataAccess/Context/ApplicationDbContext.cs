using Microsoft.EntityFrameworkCore;
using LabManager.Entity.Entities;

namespace LabManager.DataAccess.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSet'ler - Her biri bir tablo
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<StorageLocation> StorageLocations { get; set; }
    public DbSet<Drug> Drugs { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<Protocol> Protocols { get; set; }
    public DbSet<ProtocolCategory> ProtocolCategories { get; set; }
    public DbSet<LabNote> LabNotes { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<DeviceCategory> DeviceCategories { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<WarehouseCategory> WarehouseCategories { get; set; }
    public DbSet<WarehouseItem> WarehouseItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration'ları otomatik yükle
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}

