# 🎨 Frontend Geliştirme Rehberi (Basit & Minimal)
## Next.js 14 + TypeScript + Tailwind CSS

---

## ⚠️ TASARIM FELSEFESİ

**Basit, sade, fonksiyonel!**
- Abartılı animasyon YOK
- Fancy component library YOK (Shadcn/ui vs.)
- Gereksiz süsleme YOK
- Sadece temel HTML + CSS + Tailwind
- Çalışan, anlaşılır bir arayüz YETER

---

# ADIM 1: PROJE KURULUMU

## 1.1 Next.js Projesi Oluştur
Terminalden:
1. `npx create-next-app@latest frontend`
2. Soruları yanıtla:
   - TypeScript? YES
   - ESLint? YES
   - Tailwind CSS? YES
   - src/ directory? NO
   - App Router? YES
   - Import alias? YES (@/*)

## 1.2 Gerekli Paketleri Yükle
Sadece bunlar yeter:
- `npm install axios` - API istekleri için
- `npm install @tanstack/react-query` - Data fetching
- `npm install zustand` - State management
- `npm install date-fns` - Tarih formatla

**KURMA:**
- Shadcn/ui YOK
- Fancy UI kütüphanesi YOK
- Animasyon kütüphanesi YOK

---

# ADIM 2: KLASÖR YAPISINI OLUŞTUR

```
frontend/
├── app/
│   ├── login/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/page.tsx
│   │   ├── storage/page.tsx
│   │   └── equipment/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── ProductTable.tsx
│   └── ProductForm.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
├── stores/
│   └── authStore.ts
└── public/
```

---

# ADIM 3: API CLIENT OLUŞTUR

## 3.1 Axios Client Setup
`lib/api.ts` dosyası oluştur:
- Base URL tanımla
- Axios instance oluştur
- Request interceptor (JWT token ekle)
- Response interceptor (Hata yönetimi)
- GET, POST, PUT, DELETE fonksiyonları

## 3.2 TypeScript Types
`lib/types.ts` dosyası oluştur:
- Product interface
- User interface
- Category interface
- ApiResponse<T> interface
- Diğer types

---

# ADIM 4: STATE MANAGEMENT

## 4.1 Auth Store (Zustand)
`stores/authStore.ts` oluştur:
- user state
- token state
- isAuthenticated state
- login function
- logout function
- localStorage ile persist

---

# ADIM 5: AUTHENTICATION

## 5.1 Login Page
`app/login/page.tsx` oluştur:
- Basit HTML form
- Username ve password input
- Submit button
- Hata mesajı gösterme
- Başarılı login'de dashboard'a yönlendir

**Tasarım:**
- Ortada bir card/kutu
- Minimal Tailwind class'ları
- Responsive olsun yeterli

## 5.2 Auth Hook (Opsiyonel)
`hooks/useAuth.ts` oluştur:
- login mutation
- logout function
- React Query ile

---

# ADIM 6: DASHBOARD LAYOUT

## 6.1 Sidebar Component
`components/Sidebar.tsx` oluştur:
- Sol tarafta sabit menü
- Link'ler:
  - Dashboard
  - Stok Yönetimi
  - Depolama Alanları
  - Cihazlar
  - Atık Yönetimi
  - Ayarlar
- Active link gösterimi
- Basit background color ile ayırma

## 6.2 Navbar Component
`components/Navbar.tsx` oluştur:
- Üst bar
- Kullanıcı adı göster
- Çıkış butonu
- Bildirim ikonu (opsiyonel)

## 6.3 Dashboard Layout
`app/dashboard/layout.tsx` oluştur:
- Authentication kontrolü
- Sidebar + Navbar yerleştirme
- Children için alan
- Flexbox ile basit layout

---

# ADIM 7: DASHBOARD HOME PAGE

## 7.1 İstatistik Kartları
`app/dashboard/page.tsx` oluştur:
- 4 adet kart:
  - Toplam Ürün
  - Düşük Stok
  - SKT Yaklaşan
  - Bakım Bekleyen
- React Query ile data fetch
- Basit grid layout

## 7.2 Uyarılar
- Kırmızı/sarı kutu
- Düşük stok uyarısı
- SKT uyarısı

---

# ADIM 8: ÜRÜN LİSTELEME

## 8.1 Products Table
`components/ProductTable.tsx` oluştur:
- HTML table
- Sütunlar: Ad, Kategori, Miktar, Durum
- Arama inputu
- Düzenle/Sil butonları
- Pagination (opsiyonel)

**Stil:**
- Basit border'lı table
- Hover effect (arka plan rengi değişsin)
- Responsive değilse de olur (desktop öncelikli)

## 8.2 Products Page
`app/dashboard/products/page.tsx` oluştur:
- "Yeni Ürün" butonu
- ProductTable component'ini kullan
- Loading state
- Empty state

---

# ADIM 9: ÜRÜN EKLEME/DÜZENLEME

## 9.1 Product Form
`components/ProductForm.tsx` oluştur:
- Basit HTML form
- Input'lar:
  - Ürün adı
  - Kategori (select)
  - Miktar
  - Birim
  - Saklama koşulu
  - Depolama yeri
  - Notlar
- Kaydet/İptal butonları

## 9.2 Form Validation
- HTML5 required attribute
- Basit kontroller
- Hata mesajları kırmızı renkte

---

# ADIM 10: DİĞER SAYFALAR

Aynı mantıkla oluştur:

## 10.1 Storage Locations Page
- Dolap 1, 2, 3 ve Depo listesi
- Her birinde kaç ürün var
- Ekleme formu

## 10.2 Equipment Page
- Cihaz listesi
- Bakım geçmişi
- Ekleme formu

## 10.3 Settings Page (Basit)
- Kullanıcı bilgileri
- Şifre değiştirme
- Kategori yönetimi

---

# ADIM 11: TAILWIND STYLING

## 11.1 Temel Class'lar
Kullanabileceğin Tailwind class'ları:
- Layout: `flex`, `grid`, `container`
- Spacing: `p-4`, `m-2`, `gap-4`
- Colors: `bg-white`, `text-gray-700`, `border-gray-200`
- Typography: `text-lg`, `font-bold`
- Hover: `hover:bg-gray-50`

## 11.2 Renkler (Basit Palet)
- Primary: `blue-600` (Butonlar)
- Background: `gray-50` (Sayfa arka planı)
- White: `white` (Card'lar)
- Text: `gray-700` (Normal metin)
- Danger: `red-600` (Sil butonu, hatalar)
- Warning: `yellow-500` (Uyarılar)

## 11.3 Component Style Örneği

**Buton:**
```
className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
```

**Input:**
```
className="w-full px-3 py-2 border border-gray-300 rounded"
```

**Card:**
```
className="bg-white p-6 rounded shadow"
```

**Table:**
```
className="w-full border-collapse"
```

---

# ADIM 12: REACT QUERY SETUP

## 12.1 Query Client
`app/providers.tsx` oluştur:
- QueryClient oluştur
- QueryClientProvider ekle

## 12.2 Root Layout'a Ekle
`app/layout.tsx` içine Providers'ı sar

## 12.3 Custom Hooks
`hooks/useProducts.ts` örneği:
- useQuery ile ürünleri getir
- useMutation ile ürün ekle/güncelle/sil

---

# ADIM 13: ENV VARIABLES

## 13.1 .env.local Oluştur
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 13.2 Kullanımı
`process.env.NEXT_PUBLIC_API_URL`

---

# ADIM 14: TEST ET

## 14.1 Development Server
- `npm run dev`
- `http://localhost:3000` aç

## 14.2 Manuel Test
- Login yap
- Dashboard'ı kontrol et
- Ürün ekle
- Ürün listele
- Ürün düzenle
- Ürün sil

---

# ADIM 15: BUILD & DEPLOYMENT

## 15.1 Production Build
- `npm run build`
- Hataları düzelt
- `npm run start` ile test et

## 15.2 Docker (Opsiyonel)
- Dockerfile oluştur
- docker-compose.yml'e ekle

---

# ✅ TAMAMLANDIĞINDA ELİNİZDE OLACAKLAR

- ✅ Basit, çalışan bir arayüz
- ✅ Login sistemi
- ✅ Dashboard
- ✅ CRUD operasyonları
- ✅ Responsive (temel)
- ✅ API entegrasyonu
- ✅ State management
- ✅ TypeScript type safety

---

# 🎨 TASARIM PRENSİPLERİ

**YAPILACAKLAR:**
- ✅ Temiz, okunaklı kod
- ✅ Basit, anlaşılır UI
- ✅ Fonksiyonel butonlar/formlar
- ✅ Responsive (temel düzeyde)

**YAPILMAYACAKLAR:**
- ❌ Fancy animasyonlar
- ❌ Karmaşık component library
- ❌ Gereksiz abstraction
- ❌ Over-engineering

---

**NOT:** Backend bitince frontend'e geçeceğiz. Şimdilik bu rehberi kenarda tut.

🚀 **Önce backend'i bitirelim!**

