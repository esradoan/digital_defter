-- Veritabanındaki SerialNumber sütununu kontrol et ve ekle
-- Bu scripti MySQL Workbench'te çalıştırın

-- 1. Önce mevcut sütunları kontrol et
SHOW COLUMNS FROM Products;

-- 2. Eğer SerialNumber yoksa ekle (Aşağıdaki satırı ayrıca çalıştırın)
ALTER TABLE Products ADD COLUMN SerialNumber longtext NULL;
