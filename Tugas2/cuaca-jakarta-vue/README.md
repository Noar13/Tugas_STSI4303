# 🌤️ Cuaca Jakarta — Ionic + Vue 3

Aplikasi prakiraan cuaca Jakarta menggunakan **Ionic Framework** + **Vue 3 (Composition API)**.
Data bersumber dari **Open-Meteo API**

---

## 📁 Struktur Direktori

```
cuaca-jakarta-vue/
│
├── index.html                  ← Entry HTML (Vite)
├── package.json                ← Dependensi npm
├── vite.config.js              ← Konfigurasi Vite bundler
│
└── src/
    ├── main.js                 ← Entry point: daftarkan IonicVue + Router
    ├── App.vue                 ← Root component (ion-app + ion-router-outlet)
    │
    ├── assets/
    │   └── variables.css       ← CSS Custom Properties / Tema warna
    │
    ├── router/
    │   └── index.js            ← Konfigurasi @ionic/vue-router + routes
    │
    ├── composables/
    │   └── useWeather.js       ← Custom composable: fetch API + transformasi data
    │
    ├── components/
    │   ├── WeatherHeroCard.vue ← Komponen kartu suhu terkini
    │   └── WeatherTable.vue    ← Komponen list/tabel data cuaca
    │
    └── views/
        ├── HomePage.vue        ← Halaman utama (list 168 jam)
        └── DetailPage.vue      ← Halaman detail per jam
```

---

## 🧩 Elemen Ionic yang Digunakan

| Komponen Ionic       | File              | Fungsi                                      |
|----------------------|-------------------|---------------------------------------------|
| `<ion-app>`          | App.vue           | Wrapper root wajib untuk Ionic              |
| `<ion-router-outlet>`| App.vue           | Menggantikan `<router-view>` untuk Ionic    |
| `<ion-page>`         | Semua views       | Wrapper wajib setiap halaman                |
| `<ion-header>`       | HomePage, Detail  | Container navbar bagian atas                |
| `<ion-toolbar>`      | HomePage, Detail  | Bar dalam header (background, padding)      |
| `<ion-title>`        | HomePage, Detail  | Judul di dalam toolbar                      |
| `<ion-buttons>`      | HomePage, Detail  | Grup tombol di toolbar (slot start/end)     |
| `<ion-button>`       | HomePage, Detail  | Tombol interaktif                           |
| `<ion-back-button>`  | DetailPage        | Tombol kembali otomatis (dengan history)    |
| `<ion-icon>`         | Semua             | Ikon dari library ionicons                  |
| `<ion-content>`      | Semua views       | Area konten utama yang bisa di-scroll       |
| `<ion-refresher>`    | HomePage          | Gesture pull-to-refresh (khas mobile)       |
| `<ion-spinner>`      | HomePage          | Animasi loading                             |
| `<ion-text>`         | HomePage          | Wrapper teks dengan warna Ionic             |
| `<ion-list>`         | WeatherTable      | Komponen list standar Ionic                 |
| `<ion-item>`         | WeatherTable, Det | Baris dalam list                            |
| `<ion-label>`        | WeatherTable, Det | Label/teks dalam item                       |
| `<ion-badge>`        | WeatherTable      | Badge kecil ("Sekarang")                    |
| `<ion-note>`         | DetailPage        | Teks kecil sekunder dalam item              |
| `<ion-card>`         | HeroCard, Detail  | Kartu container dengan shadow               |
| `<ion-card-header>` | HeroCard, Detail  | Header dalam kartu                          |
| `<ion-card-title>`  | DetailPage        | Judul dalam card header                     |
| `<ion-card-content>`| HeroCard, Detail  | Konten dalam kartu                          |
| `<ion-chip>`         | DetailPage        | Chip label status suhu                      |

---

## 🌐 API yang Digunakan

```
GET https://api.open-meteo.com/v1/forecast
    ?latitude=-6.2
    &longitude=106.8
    &hourly=temperature_2m
```

**Response contoh:**
```json
{
  "hourly": {
    "time": ["2025-05-17T00:00", "2025-05-17T01:00", ...],
    "temperature_2m": [27.3, 26.8, 26.4, ...]
  }
}
```

**Field yang ditampilkan:**
| Field | Keterangan |
|-------|-----------|
| `time` | Waktu pengukuran (format ISO 8601) |
| `temperature_2m` | Suhu udara 2 meter di atas permukaan (°C) |

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js ≥ 18
- npm ≥ 9

### Langkah-langkah

```bash
# 1. Masuk ke folder project
cd cuaca-jakarta-vue

# 2. Install semua dependensi
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka di browser
#    → http://localhost:5173
```

### Build untuk Production
```bash
npm run build
# Output ada di folder: dist/
```

---

## 📊 Analisa Data

- API Open-Meteo memberikan **168 data point** (7 hari × 24 jam/hari)
- Suhu Jakarta umumnya antara **24°C – 34°C** sepanjang hari
- Skema warna suhu:

| Range | Warna | Status |
|-------|-------|--------|
| ≥ 35°C | 🟠 Oranye | Sangat Panas |
| 30–34°C | 🟡 Kuning | Panas |
| 24–29°C | 🔵 Biru | Nyaman |
| < 24°C | 🟣 Ungu | Sejuk |

---

## ✅ Fitur Aplikasi

- [x] Data cuaca real-time dari Open-Meteo API
- [x] Hero card suhu terkini dengan auto-detect jam sekarang
- [x] Tabel `time` + `temperature_2m` (168 baris)
- [x] Highlight baris jam sekarang + badge "Sekarang"
- [x] Pull-to-refresh gesture (mobile native feel)
- [x] Navigasi ke halaman detail per jam
- [x] Loading spinner & error handling
- [x] Desain responsif dark mode
- [x] Struktur Ionic Vue yang proper (router, composable, views, components)