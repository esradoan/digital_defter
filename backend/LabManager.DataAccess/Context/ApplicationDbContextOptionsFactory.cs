using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MySqlConnector;

namespace LabManager.DataAccess.Context;

public static class ApplicationDbContextOptionsFactory
{
    private static readonly ServerVersion ServerVersion = new MySqlServerVersion(new Version(8, 0, 0));

    public static void Configure(DbContextOptionsBuilder optionsBuilder, string connectionString)
    {
        optionsBuilder.UseMySql(NormalizeConnectionString(connectionString), ServerVersion);
    }

    public static string NormalizeConnectionString(string connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("DefaultConnection tanımlı değil.");
        }

        var builder = new MySqlConnectionStringBuilder(connectionString)
        {
            SslMode = MySqlSslMode.None
        };

        return builder.ConnectionString;
    }
}

public sealed class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        ApplicationDbContextOptionsFactory.Configure(optionsBuilder, ResolveConnectionString());

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static string ResolveConnectionString()
    {
        var environmentConnection = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        if (!string.IsNullOrWhiteSpace(environmentConnection))
        {
            return environmentConnection;
        }

        var appSettingsPath = FindAppSettingsPath();
        using var document = JsonDocument.Parse(File.ReadAllText(appSettingsPath));

        if (document.RootElement.TryGetProperty("ConnectionStrings", out var connectionStrings) &&
            connectionStrings.TryGetProperty("DefaultConnection", out var defaultConnection) &&
            !string.IsNullOrWhiteSpace(defaultConnection.GetString()))
        {
            return defaultConnection.GetString()!;
        }

        throw new InvalidOperationException("appsettings.json içinde DefaultConnection bulunamadı.");
    }

    private static string FindAppSettingsPath()
    {
        var currentDirectory = Directory.GetCurrentDirectory();
        var candidates = new[]
        {
            Path.Combine(currentDirectory, "LabManager.API", "appsettings.json"),
            Path.GetFullPath(Path.Combine(currentDirectory, "..", "LabManager.API", "appsettings.json")),
            Path.GetFullPath(Path.Combine(currentDirectory, "..", "..", "LabManager.API", "appsettings.json")),
            Path.Combine(currentDirectory, "appsettings.json")
        };

        return candidates.FirstOrDefault(File.Exists)
            ?? throw new FileNotFoundException("appsettings.json bulunamadı.");
    }
}
