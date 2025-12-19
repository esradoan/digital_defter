# 🧬 Dijital Lab Sistemi (CancerLab Manager v1)
## Proje Dokümantasyonu ve Sistem Tasarımı

---

## 📋 İçindekiler
1. [Proje Özeti](#proje-özeti)
2. [Temel Gereksinimler](#temel-gereksinimler)
3. [Sistem Modülleri](#sistem-modülleri)
4. [Veri Yapısı](#veri-yapısı)
5. [Kullanıcı Arayüzü Tasarımı](#kullanıcı-arayüzü-tasarımı)
6. [Teknoloji Önerileri](#teknoloji-önerileri)
7. [Özellik Detayları](#özellik-detayları)
8. [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

---

## 🎯 Proje Özeti

**Amaç:** Üniversite laboratuvarındaki tüm malzemelerin, cihazların ve ilaçların sistematik şekilde kayıt altına alınması ve yönetilmesi.

**Hedef Kullanıcılar:** 
- Lab Yöneticisi/Hoca
- Araştırmacılar
- Lab Teknisyenleri
- Öğrenciler (kontrollü erişim)

---

## 📌 Temel Gereksinimler

### 1️⃣ Stok Yönetimi
- Ürün ekleme, düzenleme, silme
- Miktar takibi
- Minimum stok uyarıları
- Kullanım/çıkış kaydı
- Giriş/çıkış geçmişi

### 2️⃣ Saklama Koşulları Yönetimi
- **-80°C:** Uzun süreli saklama (Bazı ilaçlar, özel reaktifler)
- **-20°C:** Antikorlar, bazı reaktifler
- **+4°C:** Kısa süreli saklama (Medyumlar, bazı solüsyonlar)
- **Oda Sıcaklığı (RT):** Sarf malzemeler, bazı kitler

### 3️⃣ Kategori Sistemi
- **Sarf Malzemeler:** Eldiven, pipet ucu, tüp, plak vb.
- **Reaktifler:** Kimyasal maddeler, solüsyonlar
- **Antikorlar:** Primary, Secondary antikorlar
- **İlaçlar/Inhibitörler:** Tedavi amaçlı veya deney için kullanılan bileşikler
- **Kitler:** ELISA kit, qPCR kit, Western Blot kit vb.
- **Cihazlar:** Lab ekipmanları

### 4️⃣ Depolama Yeri Takibi
- **Dolap 1:** Raf/bölüm bilgisi (Oda sıcaklığı malzemeler)
- **Dolap 2:** Raf/bölüm bilgisi (Oda sıcaklığı malzemeler)
- **Dolap 3:** Raf/bölüm bilgisi (Oda sıcaklığı malzemeler)
- **Depo:** Tüm soğutmalı alanlar ve diğer depolama yerleri
  - Derin Dondurucu (-80°C): Raf/Kutu/Pozisyon
  - Freezer (-20°C): Raf/Bölüm
  - Buzdolabı (+4°C): Raf/Bölüm
  - Diğer depolama alanları

---

## 🔧 Sistem Modülleri

### A) Ana Modüller

#### 📦 1. Stok Takip Modülü (Reaktif, Antikor, İlaç, Kit, Sarf Malzemeleri)
**Alanlar:**
- Ürün Adı
- Kategori (dropdown)
- Katalog Numarası
- Firma/Marka
- Lot Numarası
- Son Kullanma Tarihi (Expiry Date)
- Miktar (sayı + birim: ml, µl, adet, gr, vb.)
- Minimum Stok Seviyesi (uyarı için)
- Saklama Koşulu (-80°C, -20°C, +4°C, RT)
- Depolama Yeri (Dolap/Raf/Kutu bilgisi)
- Açılma Tarihi (varsa)
- Notlar/Açıklama
- Fiyat (opsiyonel)
- Tedarikçi Bilgisi
- Eklenme Tarihi (otomatik)
- Son Güncelleme (otomatik)

**Özellikler:**
- Stok giriş/çıkış yapma
- Lot bazlı takip
- Expiry date uyarıları (30 gün önceden)
- Düşük stok uyarıları
- Arama ve filtreleme (kategori, depolama, firma)
- QR kod/barkod oluşturma (opsiyonel gelecek özellik)

---

#### 🧪 2. İlaç Lot & Expiry Takibi (Ösimeritinib, Deneymekte Olan vb.)
**Alanlar:**
- İlaç Adı
- Lot Numarası
- Son Kullanma Tarihi
- Konsantrasyon (örn: 10mM, 100µM)
- Çözücü (DMSO, PBS, vb.)
- Hazırlanma Tarihi
- Miktar
- Saklama Koşulu
- Aliquot Bilgisi (kaç tüp, her birinde ne kadar)
- Kullanıldığı Deney/Protokol
- Notlar

---

#### 🗑️ 3. Atık Kodu Modülü (örn. 180102 - ilaç atık kategorisi)
**Alanlar:**
- Atık Kodu (örn: 180102)
- Atık Kategorisi
- Açıklama
- İmha Yöntemi
- Sorumlu Kurum/Firma
- Kayıtlar (tarih, miktar, kim imha etti)

**Özellikler:**
- Atık kayıt tutma
- İmha tarihi takibi
- Atık kategorilerine göre raporlama

---

#### 🔬 4. Cihaz Yönetimi
**Alanlar:**
- Cihaz Adı
- Marka
- Model
- Seri Numarası
- Satın Alma Tarihi
- Garanti Bitiş Tarihi
- Bakım Periyodu (örn: 6 ayda bir)
- Son Bakım Tarihi
- Sonraki Bakım Tarihi (otomatik hesaplama)
- Kalibrasyon Durumu
- Kullanım Kılavuzu (dosya yükleme)
- Arıza Geçmişi
- Durum (Çalışıyor/Arızalı/Bakımda)
- Konum (Lab içindeki yeri)
- Notlar

**Özellikler:**
- Bakım hatırlatıcıları
- Arıza kaydı tutma
- Cihaz rezervasyon sistemi (opsiyonel gelecek özellik)

---

#### 📊 5. Dashboard – Günlük Haftalık Stok Özet
**Gösterilecekler:**
- ⚠️ Düşük stok uyarıları (kritik seviyede olanlar)
- ⏰ Yaklaşan son kullanma tarihleri (30 gün içinde)
- 🔔 Bekleyen cihaz bakımları
- 📈 Son 7 gün içinde yapılan stok hareketleri
- 📦 Toplam ürün sayısı (kategorilere göre)
- 🗄️ Dolaplara göre ürün dağılımı (Dolap 1, 2, 3, Depo)
- 💰 Aylık harcama özeti (opsiyonel)

---

#### 👥 6. Kullanıcı Yönetimi
**Roller:**
- **Admin (Hoca/Lab Yöneticisi):** Tüm yetkiler
- **Araştırmacı:** Stok çıkışı yapabilir, ekleme/düzenleme sınırlı
- **Görüntüleyici (Öğrenci):** Sadece görüntüleme

**Özellikler:**
- Kullanıcı ekleme/çıkarma
- Rol atama
- İşlem geçmişi (kim, ne zaman, ne yaptı)

---

## 🗄️ Veri Yapısı

### Veritabanı Tabloları (Önerilen)

#### 1. **products** (Genel Stok Tablosu)
```
id, name, category_id, catalog_number, brand, lot_number, 
expiry_date, quantity, unit, min_stock_level, storage_condition,
storage_location, opening_date, notes, price, supplier, 
created_at, updated_at, created_by
```

#### 2. **categories**
```
id, name, description, icon
```

#### 3. **storage_locations**
```
id, name, type (dolap1/dolap2/dolap3/depo), 
description, temperature_condition, capacity_info
```

#### 4. **drugs**
```
id, name, lot_number, expiry_date, concentration, solvent,
preparation_date, quantity, storage_condition, aliquot_info,
experiment_protocol, notes, created_at, updated_at
```

#### 5. **waste_codes**
```
id, code, category, description, disposal_method, 
responsible_authority, created_at, updated_at
```

#### 6. **waste_records**
```
id, waste_code_id, quantity, disposal_date, disposed_by, notes
```

#### 7. **equipment**
```
id, name, brand, model, serial_number, purchase_date,
warranty_end_date, maintenance_period, last_maintenance_date,
next_maintenance_date, calibration_status, manual_file,
status, location, notes, created_at, updated_at
```

#### 8. **equipment_maintenance_history**
```
id, equipment_id, maintenance_date, performed_by, 
issue_found, action_taken, cost, notes
```

#### 9. **stock_movements**
```
id, product_id, movement_type (in/out), quantity, 
reason, performed_by, date, notes
```

#### 10. **users**
```
id, username, email, password_hash, role, full_name,
created_at, last_login
```

#### 11. **activity_logs**
```
id, user_id, action, table_name, record_id, 
old_value, new_value, timestamp
```

---

## 🎨 Kullanıcı Arayüzü Tasarımı

### Ana Sayfa (Dashboard)
```
┌─────────────────────────────────────────────────────┐
│  🧬 CancerLab Manager v1          👤 Admin  🔔(5)  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ⚠️ Uyarılar                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │ • 3 ürünün stoğu azaldı                       │  │
│  │ • 5 ürünün son kullanma tarihi yaklaşıyor     │  │
│  │ • 2 cihazın bakım zamanı geldi                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  📊 Hızlı İstatistikler                              │
│  ┌───────┬───────┬───────┬───────┐                 │
│  │  342  │   45  │   18  │    8  │                 │
│  │ Ürün  │ Kit   │ İlaç  │ Cihaz │                 │
│  └───────┴───────┴───────┴───────┘                 │
│                                                      │
│  🗄️ Dolap Dağılımı                                   │
│  Dolap 1: 85 ürün  |  Dolap 2: 62 ürün              │
│  Dolap 3: 48 ürün  |  Depo: 147 ürün                │
│                                                      │
│  📈 Son Hareketler                                   │
│  ┌──────────────────────────────────────────────┐  │
│  │ 19.12.2025 - PBS çıkış (100ml) - Ali Yılmaz  │  │
│  │ 18.12.2025 - Antikor giriş (5ml) - Ayşe D.   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Menü Yapısı
```
📦 Stok Yönetimi
   ├── Tüm Ürünler
   ├── Reaktifler
   ├── Antikorlar
   ├── İlaçlar
   ├── Kitler
   └── Sarf Malzemeler

🗄️ Depolama Alanları
   ├── Dolap 1
   ├── Dolap 2
   ├── Dolap 3
   └── Depo (Tüm soğutmalı alanlar)

🔬 Cihazlar
   ├── Tüm Cihazlar
   ├── Bakım Takvipi
   └── Arıza Kayıtları

🗑️ Atık Yönetimi
   ├── Atık Kodları
   └── İmha Kayıtları

📊 Raporlar
   ├── Stok Raporu
   ├── Kullanım Raporu
   ├── Depolama Raporu
   └── Harcama Raporu

⚙️ Ayarlar
   ├── Kullanıcı Yönetimi
   ├── Kategori Yönetimi
   ├── Depolama Yönetimi
   └── Sistem Ayarları
```

### Ürün Ekleme Formu (Örnek)
```
┌─────────────────────────────────────────┐
│  Yeni Ürün Ekle                         │
├─────────────────────────────────────────┤
│                                          │
│  Ürün Adı: [________________]           │
│  Kategori: [Reaktif ▼]                  │
│  Katalog No: [________________]         │
│  Firma: [________________]              │
│  Lot No: [________________]             │
│  Son Kullanma: [📅 __.__.____]          │
│  Miktar: [___] [ml ▼]                   │
│  Min. Stok: [___]                       │
│  Saklama: [-20°C ▼]                     │
│  Depolama Alanı: [Depo ▼]              │
│  Detay Konum: [Freezer - Raf 3]        │
│  Notlar: [________________]             │
│                                          │
│  [İptal]  [Kaydet]                      │
└─────────────────────────────────────────┘
```

---

## 💻 Teknoloji Önerileri

### Seçenek 1: Web Tabanlı (Önerilen)
**Frontend:**
- React.js / Next.js (Modern, hızlı)
- TailwindCSS / Material-UI (Güzel görünüm)
- Chart.js (Grafikler için)

**Backend:**
- Node.js + Express.js VEYA
- Python + FastAPI / Django

**Veritabanı:**
- PostgreSQL (Güçlü, ücretsiz)
- MySQL (Alternatif)

**Avantajları:**
- Tüm cihazlardan erişim
- Çoklu kullanıcı desteği
- Kolay yedekleme
- Uzaktan erişim

---

### Seçenek 2: Desktop Uygulama
**Teknoloji:**
- Electron (JavaScript tabanlı)
- Python + PyQt / Tkinter

**Veritabanı:**
- SQLite (Lokal, basit)

**Avantajları:**
- İnternet bağımlılığı yok
- Daha hızlı
- Basit kurulum

---

### Seçenek 3: Hibrit (En Esnek)
- Web arayüzü + PWA (Progressive Web App)
- Hem online hem offline çalışma
- Mobil cihazlarda uygulama gibi

---

## 🌟 Özellik Detayları

### 1. Akıllı Uyarı Sistemi
- **Email bildirimleri** (opsiyonel)
- **Dashboard üzerinde renkli göstergeler:**
  - 🔴 Kırmızı: Kritik (stok bitti, son kullanma tarihi geçti)
  - 🟡 Sarı: Uyarı (stok azaldı, 30 gün içinde expire)
  - 🟢 Yeşil: Normal

### 2. Arama ve Filtreleme
- Hızlı arama (ürün adı, katalog no, firma)
- Gelişmiş filtreleme:
  - Kategoriye göre
  - Saklama koşuluna göre
  - Depolama yerine göre
  - Son kullanma tarihine göre

### 3. Stok Hareketi Takibi
- Her giriş/çıkış kaydedilir
- Kim, ne zaman, ne kadar kullandı
- Kullanım nedeni (hangi deney için)
- Geçmiş görüntüleme

### 4. Rapor Oluşturma
- **Stok Raporu:** Mevcut tüm ürünler
- **Kullanım Raporu:** Belirli dönemde kullanılan ürünler
- **Harcama Raporu:** Aylık/yıllık harcamalar
- **Expiry Raporu:** Yaklaşan son kullanma tarihleri
- **Excel/PDF export**

### 5. QR Kod / Barkod (Gelecek Özellik)
- Her ürün için QR kod üretme
- Mobil uygulamayla QR kod okutup hızlı stok çıkışı

### 6. Yedekleme Sistemi
- Otomatik günlük yedekleme
- Manuel yedek alma
- Yedekten geri yükleme

---

## 🚀 Gelecek Geliştirmeler (v2, v3...)

### Faz 2:
- 📱 Mobil uygulama (iOS/Android)
- 🏷️ QR kod/barkod okuma
- 📧 Otomatik email bildirimleri
- 📅 Cihaz rezervasyon sistemi
- 🔐 2FA (İki faktörlü kimlik doğrulama)

### Faz 3:
- 🤖 AI destekli stok tahmini
- 📊 Gelişmiş analytics
- 🔗 Tedarikçi entegrasyonu (otomatik sipariş)
- 📷 Ürün fotoğrafları
- 🌐 Çoklu laboratuvar desteği

---

## 📝 Geliştirme Adımları

### Aşama 1: Planlama ✅
- [x] Gereksinimlerin belirlenmesi
- [x] Veri yapısının tasarlanması
- [x] UI/UX tasarımı

### Aşama 2: Temel Altyapı
- [ ] Veritabanı kurulumu
- [ ] Backend API geliştirme
- [ ] Authentication sistemi

### Aşama 3: Temel Modüller
- [ ] Stok yönetimi modülü
- [ ] Dashboard
- [ ] Kullanıcı arayüzü

### Aşama 4: İleri Modüller
- [ ] Cihaz yönetimi
- [ ] Atık yönetimi
- [ ] Depolama alanı yönetimi

### Aşama 5: Test ve İyileştirme
- [ ] Kullanıcı testleri
- [ ] Bug düzeltmeleri
- [ ] Performans optimizasyonu

### Aşama 6: Deploy
- [ ] Sunucu kurulumu
- [ ] Kullanıcı eğitimi
- [ ] Dokümantasyon

---

## 📞 Tartışılacak Konular

### 🤔 Sorular:
1. **Kaç kişi kullanacak?** (Kullanıcı sayısı önemli)
2. **Mobil erişim şart mı?** (Web responsive yeterli mi?)
3. **Bütçe var mı?** (Sunucu, domain, hosting için)
4. **Ne kadar sürede tamamlanmalı?**
5. **Mevcut bir sistem var mı?** (Excel, vb. - veri transferi gerekir mi?)
6. **QR kod/barkod sistemi öncelik mi?**
7. **Finansal takip önemli mi?** (Fiyat, harcama raporları)
8. **Kimler ürün ekleyebilmeli?** (Sadece admin mi, herkes mi?)

### 💡 Eklenebilecek Özellikler:
- Protokol yönetimi (Deney protokolleri saklama)
- Lab günlüğü (Daily log)
- Toplantı notları
- Yayın takibi (Publications)
- Proje yönetimi
- Dosya yönetimi (PDF, doküman saklama)

---

## 🎯 Sonuç

Bu sistem ile laboratuvarınızda:
- ✅ Hiçbir ürün kaybolmaz
- ✅ Son kullanma tarihleri takip edilir
- ✅ Stok yönetimi kolay ve hızlı olur
- ✅ Dolap ve depo organizasyonu düzenli olur
- ✅ Cihaz bakımları zamanında yapılır
- ✅ Raporlama ve analiz kolaylaşır
- ✅ Zaman tasarrufu sağlanır

---

**Hazırlayan:** AI Assistant (Claude Sonnet 4.5)  
**Tarih:** 19 Aralık 2025  
**Versiyon:** 1.0  
**Durum:** Taslak - Gözden Geçirme Bekliyor

---

## 📌 Notlar Bölümü (Eklemeleriniz İçin)

```
[Buraya düşüncelerinizi, eklemek istediklerinizi yazabilirsiniz]

- 
- 
- 
```

---

*Bu döküman üzerinde istediğiniz değişiklikleri yapabilir, eklemeler/çıkarmalar yapabilirsiniz.*

