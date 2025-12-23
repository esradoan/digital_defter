ALTER TABLE `Products` ADD COLUMN `SerialNumber` longtext CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Products` MODIFY COLUMN `Unit` longtext CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Products` MODIFY COLUMN `StorageCondition` longtext CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Products` MODIFY COLUMN `Name` longtext CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Products` MODIFY COLUMN `CategoryId` int NULL;
