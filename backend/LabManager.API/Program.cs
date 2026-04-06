using System.Text;
using LabManager.Business.Services.Concrete;
using LabManager.Business.Services.Interfaces;
using LabManager.DataAccess.Context;
using LabManager.DataAccess.Repositories.Concrete;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.Entity.Entities;
using LabManager.Entity.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ====================
// 1. DATABASE CONFIGURATION
// ====================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("DefaultConnection tanımlı değil.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    ApplicationDbContextOptionsFactory.Configure(options, connectionString));

// ====================
// 2. REPOSITORY REGISTRATION (Dependency Injection)
// ====================
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// ====================
// 3. SERVICE REGISTRATION
// ====================
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStorageLocationService, StorageLocationService>();
builder.Services.AddScoped<IProtocolService, ProtocolService>();
builder.Services.AddScoped<ILabNoteService, LabNoteService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<IUserService, UserService>();

// ====================
// 4. JWT AUTHENTICATION
// ====================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new Exception("JWT SecretKey bulunamadı!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// ====================
// 5. CORS POLICY (Frontend için)
// ====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:3000",
                  "http://localhost:5173",
                  "http://localhost:5174",
                  "http://localhost:5175",
                  "http://localhost:5176",
                  "http://localhost:5177",
                  "https://labyonetimi.com",
                  "https://www.labyonetimi.com"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Content-Disposition")
              .AllowCredentials();
    });
});

// ====================
// 6. CONTROLLERS & SWAGGER
// ====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ====================
// 7. MIDDLEWARE PIPELINE
// ====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lab Manager API v1");
    });
}

var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}

app.UseStaticFiles();
var allowedOrigins = new[] { "https://labyonetimi.com", "https://www.labyonetimi.com" };
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsDir),
    RequestPath = "/uploads",
    OnPrepareResponse = ctx =>
    {
        var origin = ctx.Context.Request.Headers["Origin"].ToString();
        if (allowedOrigins.Contains(origin))
        {
            ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", origin);
        }
    }
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Lab Manager API is running!");

// ====================
// 8. ADMIN SEEDER
// ====================
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("DatabaseStartup");
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        db.Database.Migrate();

        if (!db.Set<User>().Any(u => u.Role == UserRole.Admin))
        {
            db.Set<User>().Add(new User
            {
                Username = "admin",
                Email = "admin@labmanager.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FullName = "Sistem Yöneticisi",
                Role = UserRole.Admin,
                IsApproved = true,
                CreatedAt = DateTime.UtcNow
            });
            db.SaveChanges();
            logger.LogInformation("Varsayılan yönetici hesabı oluşturuldu.");
        }
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Uygulama açılışında veritabanı migration işlemi başarısız oldu.");
        throw;
    }
}

app.Run();
