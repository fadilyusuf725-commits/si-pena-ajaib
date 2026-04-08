# Si Pena Ajaib

Si Pena Ajaib adalah situs statis untuk belajar menulis huruf, kata, dan cerita secara interaktif. Proyek ini ditujukan untuk dijalankan langsung di browser dan dipublikasikan lewat GitHub Pages.

## Fitur

- `Hurufku`: tracing huruf besar dan kecil A-Z dengan panduan garis bantu
- `Kataku`: latihan menulis kata dengan validasi tracing yang lebih ketat
- `Ceritaku`: menyusun kalimat dari gambar dengan drag-and-drop
- `Gamifikasi v1`: bintang dan badge tersimpan di browser
- `Resume belajar`: tombol `Mulai Belajar` melanjutkan ke halaman terakhir

## Struktur Aktif

```text
.
├── index.html
├── favicon.svg
├── _config.yml
└── main menu/
    ├── main menu.html
    ├── main menu.css
    ├── main menu.js
    ├── rewards.js
    ├── pena.png
    ├── menu hurufku/
    ├── menu kataku/
    └── menu ceritaku/
```

## Menjalankan Lokal

Karena ini situs statis, cukup layani folder proyek dengan server file statis.

Contoh dengan Python:

```bash
python -m http.server 4173
```

Lalu buka `http://127.0.0.1:4173/`.

## Deploy

Konfigurasi GitHub Pages ada di `_config.yml`.

URL produksi:

`https://fadilyusuf725-commits.github.io/si-pena-ajaib/`

## Penyimpanan Browser

Progress dan reward disimpan di `localStorage` dengan key berikut:

- `progressLetters`
- `cerita_progress`
- `lastVisitedFull`
- `bgmPlaying`
- `bgmTime`
- `rewardStars`
- `badgesUnlocked`
- `rewardClaims`
