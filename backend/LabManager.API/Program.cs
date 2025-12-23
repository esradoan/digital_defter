using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using LabManager.DataAccess.Context;
using LabManager.DataAccess.Repositories.Interfaces;
using LabManager.DataAccess.Repositories.Concrete;
using LabManager.Business.Services.Interfaces;
using LabManager.Business.Services.Concrete;

var builder = WebApplication.CreateBuilder(args);

// ====================
// 1. DATABASE CONFIGURATION
// ====================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// var connectionString = "server=127.0.0.1;port=3306;database=labmanager_db;uid=root;pwd=1234;SslMode=None;AllowPublicKeyRetrieval=True;Pooling=False;";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 21)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null)
    );
}, ServiceLifetime.Scoped);

// ====================
// 2. REPOSITORY REGISTRATION
// ====================
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// ====================
// 3. SERVICE REGISTRATION
// ====================
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStorageLocationService, StorageLocationService>();

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
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
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
// 8. SEED DATA
// ====================
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        LabManager.DataAccess.Data.DbSeeder.SeedData(context);
    }
}
catch (Exception ex)
{
    Console.WriteLine($"⚠️  Uyarı: Seed data eklenemedi. MySQL çalışıyor mu?");
    Console.WriteLine($"   Hata: {ex.Message}");
}

app.Run();
