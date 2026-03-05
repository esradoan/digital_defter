using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using LabManager.DataAccess.Context;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.DataAccess.Repositories.Concrete;
using LabManager.Business.Services.Interfaces;
using LabManager.Business.Services.Concrete;
using LabManager.Entity.Entities;
using LabManager.Entity.Enums;

var builder = WebApplication.CreateBuilder(args);

// ====================
// 1. DATABASE CONFIGURATION
// ====================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);

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
                  "http://localhost:5177"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
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

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Test endpoint
app.MapGet("/", () => "🧬 Lab Manager API is running!");
// ====================
// 8. ADMIN SEEDER — İlk admin hesabını oluştur
// ====================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
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
    }
}

app.Run();
