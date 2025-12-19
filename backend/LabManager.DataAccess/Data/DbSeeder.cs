using LabManager.DataAccess.Context;
using LabManager.Entity.Entities;
using LabManager.Entity.Enums;

namespace LabManager.DataAccess.Data;

public static class DbSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        // Database oluştur
        context.Database.EnsureCreated();

        // Zaten veri varsa seed'leme
        if (context.Users.Any())
            return;

        Console.WriteLine("🌱 Seed data ekleniyor...");

        // 1. Admin kullanıcısı
        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@labmanager.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            FullName = "Admin User",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(adminUser);

        // 2. Kategoriler
        var categories = new[]
        {
            new Category 
            { 
                Name = "Sarf Malzemeler", 
                Description = "Eldiven, pipet ucu, tüp, plak vb.",
                Icon = "🧪",
                CreatedAt = DateTime.UtcNow
            },
            new Category 
            { 
                Name = "Reaktifler", 
                Description = "Kimyasal maddeler, solüsyonlar",
                Icon = "⚗️",
                CreatedAt = DateTime.UtcNow
            },
            new Category 
            { 
                Name = "Antikorlar", 
                Description = "Primary, Secondary antikorlar",
                Icon = "🔬",
                CreatedAt = DateTime.UtcNow
            },
            new Category 
            { 
                Name = "İlaçlar", 
                Description = "Tedavi ve deney bileşikleri",
                Icon = "💊",
                CreatedAt = DateTime.UtcNow
            },
            new Category 
            { 
                Name = "Kitler", 
                Description = "ELISA, qPCR, Western Blot kitleri",
                Icon = "📦",
                CreatedAt = DateTime.UtcNow
            }
        };
        context.Categories.AddRange(categories);

        // 3. Depolama Lokasyonları
        var storageLocations = new[]
        {
            new StorageLocation 
            { 
                Name = "Dolap 1", 
                Type = StorageLocationType.Dolap1,
                Description = "Sarf malzemeler dolabı",
                TemperatureCondition = "Oda Sıcaklığı",
                CreatedAt = DateTime.UtcNow
            },
            new StorageLocation 
            { 
                Name = "Dolap 2", 
                Type = StorageLocationType.Dolap2,
                Description = "Kimyasallar dolabı",
                TemperatureCondition = "Oda Sıcaklığı",
                CreatedAt = DateTime.UtcNow
            },
            new StorageLocation 
            { 
                Name = "Dolap 3", 
                Type = StorageLocationType.Dolap3,
                Description = "Kitler dolabı",
                TemperatureCondition = "Oda Sıcaklığı",
                CreatedAt = DateTime.UtcNow
            },
            new StorageLocation 
            { 
                Name = "Depo", 
                Type = StorageLocationType.Depo,
                Description = "Tüm soğutmalı alanlar (-80°C, -20°C, +4°C)",
                TemperatureCondition = "Çeşitli",
                CreatedAt = DateTime.UtcNow
            }
        };
        context.StorageLocations.AddRange(storageLocations);

        context.SaveChanges();

        Console.WriteLine("✅ Seed data başarıyla eklendi!");
        Console.WriteLine($"   - Admin kullanıcısı: admin / Admin123!");
        Console.WriteLine($"   - {categories.Length} kategori eklendi");
        Console.WriteLine($"   - {storageLocations.Length} depolama lokasyonu eklendi");
    }
}

