# Smart Eco Bank — Web (Next.js + TypeScript)

Port web/desktop dari mockup HTML **Smart Eco Bank** (W1–W10) ke **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. Mengikuti pola yang sama seperti project Flutter sebelumnya: **semua data masih mock**, ditempatkan persis di titik di mana endpoint API akan dipanggil, lengkap dengan dokumentasi endpoint agar backend tinggal dipasang.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build && npm start
```

> Catatan: font (Manrope, JetBrains Mono, Material Symbols) dimuat lewat `<link>`
> di `src/app/layout.tsx`, jadi butuh koneksi internet saat dijalankan di
> browser — sama seperti mockup aslinya.

## Struktur

```
src/
├── app/                      # Routing (App Router)
│   ├── layout.tsx            # Root layout + font + AuthProvider
│   ├── globals.css           # Tailwind + util (eco-gradient, glass, scan-line)
│   ├── page.tsx              # W1  Landing + Login
│   ├── register/             # W1  Registrasi
│   ├── dashboard/            # W2  Beranda
│   ├── locations/            # W3  Lokasi Posko (peta simulasi)
│   ├── scanner/              # W4  Setor Sampah AI (upload + hasil)
│   ├── history/              # W5  Riwayat Transaksi
│   ├── rewards/              # W6  Katalog Reward
│   ├── settings/             # W7  Pengaturan + Dampak Hijau
│   ├── customer-service/     # W9  Chat CS
│   ├── notifications/        # W8  Notifikasi
│   └── about/                # W10 Tentang Kami (publik)
├── components/
│   ├── AppShell.tsx          # TopNav + Footer + BottomNav (halaman login)
│   ├── TopNavBar.tsx / BottomNavBar.tsx / Footer.tsx
│   └── ui/Icon.tsx           # Wrapper Material Symbols
├── context/
│   └── AuthContext.tsx       # State login (user, login, register, logout)
└── lib/
    ├── types.ts              # Semua interface (bentuk = response API)
    └── api.ts                # ★ Lapisan API terpusat (mock + dokumentasi)
```

## Pola Mock → Backend

Semua komunikasi data ada di **`src/lib/api.ts`**. Setiap fungsi punya:

1. Blok `TODO(API)` — spesifikasi endpoint asli (method, path, body, response).
2. Blok `// REAL:` — contoh `fetch` yang tinggal di-uncomment.
3. `return mock…` — data palsu yang dipakai sekarang.

Langkah migrasi ke backend asli:

1. Buat `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.domain-anda.com
   ```
2. Setelah login, token disimpan via `setAuthToken()` (sudah otomatis di `AuthContext`).
3. Uncomment blok `// REAL:` pada fungsi terkait, hapus baris `return mock…`.
4. Tidak perlu ubah komponen — response sudah diketik lewat `types.ts`.

### Endpoint yang sudah didokumentasikan

| Fungsi (`api.ts`)      | Endpoint                          | Layar |
| ---------------------- | --------------------------------- | ----- |
| `login`                | POST `/auth/login`                | W1    |
| `register`             | POST `/auth/register`             | W1    |
| `logout`               | POST `/auth/logout`               | W7    |
| `getDashboard`         | GET `/dashboard`                  | W2    |
| `getLocations`         | GET `/locations?q=`               | W3    |
| `analyzeWaste`         | POST `/waste/analyze` (multipart) | W4    |
| `submitDeposit`        | POST `/deposits`                  | W4    |
| `getTransactions`      | GET `/transactions?type=`         | W5    |
| `getRewards`           | GET `/rewards?category=`          | W6    |
| `redeemReward`         | POST `/rewards/{id}/redeem`       | W6    |
| `getNotifications`     | GET `/notifications`              | W8    |
| `sendSupportMessage`   | POST `/support/messages`          | W9    |

## Aturan poin

`1.000 gram = 2 poin` (0,002 poin/gram) — lihat `estimatePoints()` di `api.ts`,
dipakai live di layar scanner (W4).

## Login demo

Email `budi@email.com` / password `password` (mock menerima kredensial apa pun).

## Design system

Token Material 3 (warna, radius, spacing, type scale Manrope/JetBrains Mono)
diport persis dari konfigurasi Tailwind di mockup, ada di `tailwind.config.ts`.

> Gambar/foto eksternal pada mockup diganti placeholder `eco-gradient` + ikon
> agar project mandiri tanpa link yang mati. Ganti dengan aset asli bila perlu.
