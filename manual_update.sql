START TRANSACTION;
ALTER TABLE `Products` MODIFY COLUMN `StorageCondition` int NULL;

ALTER TABLE `Products` MODIFY COLUMN `CategoryId` int NULL;

ALTER TABLE `Products` ADD `SerialNumber` longtext CHARACTER SET utf8mb4 NULL;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20251220123215_AddSerialNoAndMakeFieldsOptional', '9.0.0');

COMMIT;

