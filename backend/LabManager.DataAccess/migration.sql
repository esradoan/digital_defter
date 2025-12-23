CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;
ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `ActivityLogs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `Action` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `TableName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `RecordId` int NULL,
    `OldValue` varchar(4000) CHARACTER SET utf8mb4 NULL,
    `NewValue` varchar(4000) CHARACTER SET utf8mb4 NULL,
    `Timestamp` datetime(6) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_ActivityLogs` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Categories` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Icon` varchar(50) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Categories` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Drugs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `LotNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
    `ExpiryDate` datetime(6) NULL,
    `Concentration` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Solvent` varchar(100) CHARACTER SET utf8mb4 NULL,
    `PreparationDate` datetime(6) NULL,
    `Quantity` decimal(18,2) NOT NULL,
    `StorageCondition` int NOT NULL,
    `AliquotInfo` varchar(500) CHARACTER SET utf8mb4 NULL,
    `ExperimentProtocol` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Notes` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Drugs` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Equipment` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Brand` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Model` varchar(100) CHARACTER SET utf8mb4 NULL,
    `SerialNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
    `PurchaseDate` datetime(6) NULL,
    `WarrantyEndDate` datetime(6) NULL,
    `MaintenancePeriodDays` int NULL,
    `LastMaintenanceDate` datetime(6) NULL,
    `NextMaintenanceDate` datetime(6) NULL,
    `CalibrationStatus` varchar(100) CHARACTER SET utf8mb4 NULL,
    `ManualFilePath` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Status` int NOT NULL,
    `Location` varchar(200) CHARACTER SET utf8mb4 NULL,
    `Notes` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Equipment` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `StorageLocations` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Type` int NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `TemperatureCondition` varchar(100) CHARACTER SET utf8mb4 NULL,
    `CapacityInfo` varchar(200) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_StorageLocations` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `Role` int NOT NULL,
    `FullName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `LastLogin` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Products` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `CategoryId` int NOT NULL,
    `CatalogNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Brand` varchar(100) CHARACTER SET utf8mb4 NULL,
    `LotNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
    `ExpiryDate` datetime(6) NULL,
    `Quantity` decimal(18,2) NOT NULL,
    `Unit` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `MinStockLevel` decimal(18,2) NULL,
    `StorageCondition` int NOT NULL,
    `StorageLocationId` int NULL,
    `DetailedLocation` varchar(200) CHARACTER SET utf8mb4 NULL,
    `OpeningDate` datetime(6) NULL,
    `Notes` longtext CHARACTER SET utf8mb4 NULL,
    `Price` decimal(18,2) NULL,
    `Supplier` varchar(100) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_Products` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Products_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Products_StorageLocations_StorageLocationId` FOREIGN KEY (`StorageLocationId`) REFERENCES `StorageLocations` (`Id`) ON DELETE SET NULL
) CHARACTER SET=utf8mb4;

CREATE TABLE `StockMovements` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `ProductId` int NOT NULL,
    `MovementType` int NOT NULL,
    `Quantity` decimal(18,2) NOT NULL,
    `Reason` varchar(500) CHARACTER SET utf8mb4 NULL,
    `PerformedBy` int NOT NULL,
    `Date` datetime(6) NOT NULL,
    `Notes` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NULL,
    `CreatedBy` int NULL,
    CONSTRAINT `PK_StockMovements` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_StockMovements_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_ActivityLogs_TableName` ON `ActivityLogs` (`TableName`);

CREATE INDEX `IX_ActivityLogs_Timestamp` ON `ActivityLogs` (`Timestamp`);

CREATE INDEX `IX_ActivityLogs_UserId` ON `ActivityLogs` (`UserId`);

CREATE INDEX `IX_Drugs_ExpiryDate` ON `Drugs` (`ExpiryDate`);

CREATE INDEX `IX_Equipment_NextMaintenanceDate` ON `Equipment` (`NextMaintenanceDate`);

CREATE INDEX `IX_Equipment_Status` ON `Equipment` (`Status`);

CREATE INDEX `IX_Products_CatalogNumber` ON `Products` (`CatalogNumber`);

CREATE INDEX `IX_Products_CategoryId` ON `Products` (`CategoryId`);

CREATE INDEX `IX_Products_ExpiryDate` ON `Products` (`ExpiryDate`);

CREATE INDEX `IX_Products_StorageLocationId` ON `Products` (`StorageLocationId`);

CREATE INDEX `IX_StockMovements_Date` ON `StockMovements` (`Date`);

CREATE INDEX `IX_StockMovements_ProductId` ON `StockMovements` (`ProductId`);

CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);

CREATE UNIQUE INDEX `IX_Users_Username` ON `Users` (`Username`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20251219162513_InitialCreate', '9.0.0');

COMMIT;

