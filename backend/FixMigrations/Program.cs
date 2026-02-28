// Bu program eski migration kayıtlarını __EFMigrationsHistory tablosuna ekler
// Çalıştır: dotnet run --project FixMigrations.csproj

using MySqlConnector;

var connectionString = "Server=localhost;Port=3306;Database=labmanager_db;User=root;Password=1234;";

using var connection = new MySqlConnection(connectionString);
await connection.OpenAsync();

Console.WriteLine("✓ MySQL bağlantısı başarılı!");

// 1. __EFMigrationsHistory tablosunu oluştur (yoksa)
var createTable = @"
CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;";

using (var cmd = new MySqlCommand(createTable, connection))
{
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ __EFMigrationsHistory tablosu hazır!");
}

// 2. Eski migration'ları "uygulandı" olarak ekle
var migrations = new[] {
    "20251219162513_InitialCreate",
    "20251220123215_AddSerialNoAndMakeFieldsOptional",
    "20260225080455_MakeUnitOptional",
    "20260225080723_MakeUnitOptional2"
};

foreach (var migrationId in migrations)
{
    var insert = $"INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('{migrationId}', '9.0.0');";
    using var cmd = new MySqlCommand(insert, connection);
    var rows = await cmd.ExecuteNonQueryAsync();
    Console.WriteLine(rows > 0 
        ? $"  ✓ Eklendi: {migrationId}" 
        : $"  - Zaten var: {migrationId}");
}

Console.WriteLine("\n✅ Tamamlandı! Şimdi 'dotnet ef database update' çalıştırabilirsiniz.");
