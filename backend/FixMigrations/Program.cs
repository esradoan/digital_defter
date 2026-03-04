// Warehouses, WarehouseCategories, WarehouseItems tabloları
using MySqlConnector;

var connectionString = "Server=localhost;Port=3306;Database=labmanager_db;User=root;Password=1234;";
using var connection = new MySqlConnection(connectionString);
await connection.OpenAsync();
Console.WriteLine("✓ MySQL bağlantısı başarılı!");

var createWarehouses = @"
CREATE TABLE IF NOT EXISTS `Warehouses` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Location` varchar(200) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Warehouses` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;";
using (var cmd = new MySqlCommand(createWarehouses, connection))
{
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ Warehouses tablosu oluşturuldu!");
}

var createWarehouseCategories = @"
CREATE TABLE IF NOT EXISTS `WarehouseCategories` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_WarehouseCategories` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;";
using (var cmd = new MySqlCommand(createWarehouseCategories, connection))
{
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ WarehouseCategories tablosu oluşturuldu!");
}

var createWarehouseItems = @"
CREATE TABLE IF NOT EXISTS `WarehouseItems` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Quantity` decimal(18,2) NOT NULL,
    `Unit` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `WarehouseId` int NOT NULL,
    `WarehouseCategoryId` int NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_WarehouseItems` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_WarehouseItems_Warehouses_WarehouseId` FOREIGN KEY (`WarehouseId`) REFERENCES `Warehouses` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_WarehouseItems_WarehouseCategories_WarehouseCategoryId` FOREIGN KEY (`WarehouseCategoryId`) REFERENCES `WarehouseCategories` (`Id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;";
using (var cmd = new MySqlCommand(createWarehouseItems, connection))
{
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ WarehouseItems tablosu oluşturuldu!");
}

var migration = "INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ('20260304130000_AddWarehouses', '9.0.0');";
using (var cmd = new MySqlCommand(migration, connection))
{
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("✓ Migration kaydı eklendi!");
}
Console.WriteLine("\n✅ Tamamlandı!");
