# 🎯 Backend Geliştirme Rehberi
## Katmanlı Mimari - .NET Core 8 + MySQL

---

## 📂 Proje Mimarisi

```
LabManager/
├── LabManager.Entity/         # Entity katmanı (Domain models)
├── LabManager.DataAccess/     # Data Access katmanı (Repository, DbContext)
├── LabManager.Business/       # Business katmanı (İş mantığı)
└── LabManager.API/            # API katmanı (Controllers, Startup)
```

---

# ADIM 1: PROJE YAPISINI OLUŞTUR

## 1.1 Solution ve Projeler Oluştur

**Terminalde yapılacaklar:**
1. `backend` klasörü oluştur
2. Solution oluştur: `dotnet new sln -n LabManager`
3. 4 adet Class Library projesi oluştur:
   - `LabManager.Entity` (Class Library)
   - `LabManager.DataAccess` (Class Library)
   - `LabManager.Business` (Class Library)
   - `LabManager.API` (Web API)
4. Tüm projeleri solution'a ekle
5. Proje referanslarını ayarla:
   - DataAccess → Entity'ye referans
   - Business → Entity ve DataAccess'e referans
   - API → Tüm katmanlara referans

---

## 1.2 NuGet Paketlerini Yükle

**LabManager.DataAccess'e:**
- Pomelo.EntityFrameworkCore.MySql
- Microsoft.EntityFrameworkCore.Tools

**LabManager.API'ye:**
- Microsoft.EntityFrameworkCore.Design
- Microsoft.AspNetCore.Authentication.JwtBearer
- Swashbuckle.AspNetCore
- BCrypt.Net-Next

**LabManager.Entity:**
- Hiçbir paket gerekmez (sadece class'lar)

**LabManager.Business:**
- Hiçbir paket gerekmez (opsiyonel: FluentValidation)

---

# ADIM 2: ENTITY KATMANI OLUŞTUR

## 2.1 BaseEntity Sınıfı
- `Entities/BaseEntity.cs` dosyası oluştur
- Ortak alanlar: Id, CreatedAt, UpdatedAt, CreatedBy

## 2.2 Enum'ları Oluştur
`Enums/` klasörü oluştur:
- `UserRole.cs` - Admin, Researcher, Viewer
- `StorageCondition.cs` - Minus80C, Minus20C, Plus4C, RoomTemperature
- `StorageLocationType.cs` - Dolap1, Dolap2, Dolap3, Depo
- `MovementType.cs` - In, Out
- `EquipmentStatus.cs` - Working, Broken, Maintenance

## 2.3 Entity Sınıflarını Oluştur
`Entities/` klasöründe şu dosyaları oluştur:
1. `User.cs` - Kullanıcı bilgileri
2. `Category.cs` - Ürün kategorileri
3. `Product.cs` - Ürün bilgileri
4. `StorageLocation.cs` - Depolama yerleri
5. `Drug.cs` - İlaç bilgileri
6. `Equipment.cs` - Cihaz bilgileri
7. `EquipmentMaintenanceHistory.cs` - Cihaz bakım geçmişi
8. `WasteCode.cs` - Atık kodları
9. `WasteRecord.cs` - Atık kayıtları
10. `StockMovement.cs` - Stok hareketleri
11. `ActivityLog.cs` - Sistem logları

**Her entity için:**
- BaseEntity'den miras al
- Property'leri tanımla
- Navigation property'leri ekle

---

# ADIM 3: DATA ACCESS KATMANI OLUŞTUR

## 3.1 DbContext Oluştur
- `Context/ApplicationDbContext.cs` dosyası oluştur
- DbSet'leri tanımla (her entity için)
- Constructor ekle (DbContextOptions parametresi)
- OnModelCreating metodunu override et

## 3.2 Entity Configurations
`Configurations/` klasörü oluştur:
- Her entity için bir configuration class'ı
- IEntityTypeConfiguration<T> interface'ini implement et
- Tablo isimleri, property kısıtlamaları, ilişkileri tanımla

## 3.3 Repository Pattern
`Repositories/Interfaces/` klasöründe:
- `IRepository.cs` - Generic repository interface

`Repositories/Concrete/` klasöründe:
- `Repository.cs` - Generic repository implementation
- CRUD metotları: GetById, GetAll, Add, Update, Delete, Find

## 3.4 Unit of Work (Opsiyonel)
- `IUnitOfWork.cs` interface'i
- `UnitOfWork.cs` implementation
- SaveChanges metodunu merkezi yönet

---

# ADIM 4: BUSINESS KATMANI OLUŞTUR

## 4.1 DTOs (Data Transfer Objects)
`DTOs/` klasöründe alt klasörler oluştur:
- `Product/` - ProductDto, CreateProductDto, UpdateProductDto
- `Category/` - CategoryDto
- `Auth/` - LoginDto, RegisterDto, LoginResponseDto
- `Common/` - ApiResponse<T>, PaginatedResponse<T>

## 4.2 Service Interfaces
`Services/Interfaces/` klasöründe:
- `IProductService.cs`
- `ICategoryService.cs`
- `IAuthService.cs`
- `IStorageLocationService.cs`
- `IEquipmentService.cs`
- `IDashboardService.cs`

**Her interface'de:**
- GetAll, GetById, Create, Update, Delete metotları
- Özel metotlar (örn: GetLowStockProducts)

## 4.3 Service Implementations
`Services/Concrete/` klasöründe:
- Her interface için implementation class'ı oluştur
- Constructor'da gerekli repository'leri inject et
- Business logic'i buraya yaz
- Entity ↔ DTO dönüşümlerini yap

## 4.4 Mapping (Manuel veya AutoMapper)
- Entity'den DTO'ya dönüşüm metodları
- DTO'dan Entity'ye dönüşüm metodları

---

# ADIM 5: API KATMANI OLUŞTUR

## 5.1 appsettings.json Yapılandırması
Eklenecekler:
- ConnectionStrings (MySQL bağlantısı)
- JwtSettings (SecretKey, Issuer, Audience, ExpirationMinutes)
- Serilog ayarları (opsiyonel)

## 5.2 Program.cs Yapılandırması
Sırasıyla ekle:
1. DbContext servisini ekle (MySQL ile)
2. Repositories'leri DI'a ekle
3. Services'leri DI'a ekle
4. JWT Authentication ekle
5. CORS politikası ekle (Frontend için)
6. Controllers ekle
7. Swagger ekle
8. Middleware pipeline'ı yapılandır

## 5.3 Controllers Oluştur
`Controllers/` klasöründe:
1. `AuthController.cs` - Login, Register
2. `ProductsController.cs` - CRUD + GetLowStock, GetExpiringSoon
3. `CategoriesController.cs` - CRUD
4. `StorageLocationsController.cs` - CRUD
5. `DrugsController.cs` - CRUD
6. `EquipmentController.cs` - CRUD + Maintenance
7. `WasteCodesController.cs` - CRUD
8. `DashboardController.cs` - İstatistikler

**Her controller için:**
- Constructor'da ilgili service'i inject et
- HTTP metotları: GET, POST, PUT, DELETE
- Route'ları tanımla: `[Route("api/[controller]")]`
- Authorization ekle: `[Authorize]` (Auth hariç)
- ApiResponse<T> kullanarak standart response dön

## 5.4 Middleware & Filters (Opsiyonel)
- Exception handling middleware
- Logging middleware
- Model validation filter

---

# ADIM 6: DATABASE OLUŞTUR

## 6.1 MySQL Kurulumu
**Docker ile (Önerilen):**
- docker-compose.yml oluştur
- MySQL servisini tanımla
- `docker-compose up -d` ile çalıştır

**Veya:**
- MySQL 8.0 manuel kur
- Veritabanı oluştur: `labmanager_db`
- Kullanıcı oluştur ve yetki ver

## 6.2 Migration Oluştur ve Uygula
Terminalden:
1. LabManager.API klasörüne git
2. Migration oluştur: `dotnet ef migrations add InitialCreate`
3. Database'e uygula: `dotnet ef database update`

## 6.3 Seed Data Ekleme
`Data/DbInitializer.cs` oluştur:
- İlk admin kullanıcısı
- Varsayılan kategoriler
- Depolama lokasyonları
- Test verileri (opsiyonel)

Program.cs'de seed data'yı çağır

---

# ADIM 7: AUTHENTICATION SISTEMI

## 7.1 JWT Token Generation
`IAuthService` içinde:
- `GenerateJwtToken` metodu
- User bilgilerinden claims oluştur
- Token'ı imzala ve döndür

## 7.2 Password Hashing
- BCrypt kullanarak şifre hash'le
- Login'de şifre doğrulama

## 7.3 Login/Register Endpoint
- POST /api/auth/login
- POST /api/auth/register
- Token döndür

---

# ADIM 8: TEST ET

## 8.1 API'yi Çalıştır
- `dotnet run` ile başlat
- Swagger'a git: `http://localhost:5000/swagger`

## 8.2 Postman/Thunder Client ile Test
Sırasıyla test et:
1. Register endpoint
2. Login endpoint (token al)
3. Token ile diğer endpoint'leri test et

## 8.3 Manuel Test Senaryoları
- Ürün ekleme
- Ürün listeleme
- Ürün güncelleme
- Ürün silme
- Low stock kontrolü
- Expiring soon kontrolü

---

# ADIM 9: HATA AYIKLAMA & İYİLEŞTİRME

## 9.1 Yaygın Hatalar
- Connection string hatası
- Migration hatası
- JWT token hatası
- CORS hatası

## 9.2 Logging Ekle
- Console logging
- File logging (Serilog)
- Database logging (opsiyonel)

## 9.3 Performans
- Lazy loading vs Eager loading
- Index'leri kontrol et
- N+1 problem kontrolü

---

# ADIM 10: DOKÜMANTASYON

## 10.1 API Dokümantasyonu
- Swagger'ı yapılandır
- Endpoint'lere açıklama ekle
- DTO'lara örnek değerler ekle

## 10.2 README.md Oluştur
İçerik:
- Proje hakkında
- Kurulum adımları
- Çalıştırma komutları
- API endpoint'leri
- Environment variables

---

# ✅ TAMAMLANDIĞINDA ELİNİZDE OLACAKLAR

- ✅ 4 katmanlı temiz mimari
- ✅ MySQL veritabanı
- ✅ 11 tablo ile tam veri modeli
- ✅ JWT authentication
- ✅ 8+ controller, 50+ endpoint
- ✅ Repository pattern
- ✅ Dependency injection
- ✅ Swagger dokümantasyonu
- ✅ Docker desteği (opsiyonel)
- ✅ CORS yapılandırması (Frontend için hazır)

---

# 🚀 ŞİMDİ BAŞLAYALIM

**Hangi adımdan başlamak istersiniz?**

1. ADIM 1: Proje yapısını oluşturma
2. ADIM 2: Entity'leri tanımlama
3. ADIM 3: DbContext ve Repository
4. Diğer...

**Birlikte adım adım ilerleyelim!** 🎯

