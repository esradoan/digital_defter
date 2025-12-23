-- StorageCondition sütununu NULL kabul edecek şekilde güncelle
ALTER TABLE Products MODIFY COLUMN StorageCondition int NULL;
