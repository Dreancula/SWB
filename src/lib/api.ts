import type {
  AuthResponse,
  DashboardData,
  DropLocation,
  Reward,
  Transaction,
  ScanResult,
  ChatMessage,
  AppNotification,
  User,
} from "./types";

/**
 * ============================================================================
 * api.ts — Lapisan tunggal untuk SEMUA komunikasi ke backend.
 * ----------------------------------------------------------------------------
 * Saat ini setiap fungsi mengembalikan MOCK DATA dengan delay buatan
 * (lihat `mockDelay`). Tiap fungsi dilengkapi:
 *   1. Blok `TODO(API)`  : deskripsi endpoint asli (method, path, body, resp).
 *   2. Blok `// REAL:`   : contoh kode fetch yang tinggal di-uncomment.
 *   3. `return mockX`    : data palsu yang dipakai sekarang.
 *
 * Cara migrasi ke backend asli:
 *   1. Set NEXT_PUBLIC_API_BASE_URL di .env.local
 *   2. Simpan token via setAuthToken() setelah login.
 *   3. Uncomment blok `// REAL:` dan hapus baris `return mockX`.
 *   4. Parsing otomatis karena response sudah diketik (lihat types.ts).
 * ============================================================================
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.smartecobank.example.com";

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Header standar untuk request terautentikasi (dipakai saat REAL aktif).
export function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

const mockDelay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------
const mockUser: User = {
  id: "usr_001",
  fullName: "Budi Santoso",
  email: "budi@email.com",
  phone: "0812xxxxxxx",
  address: "Jl. Hijau Lestari No. 123, Jakarta",
  avatarUrl: null,
  pointBalance: 12450,
  greenLevel: "Level 4: Green Hero",
  co2SavedKg: 12,
};

const mockTransactions: Transaction[] = [
  {
    id: "TRX-9920110",
    date: "2024-10-24",
    timeLabel: "14:20 WIB",
    category: "Plastik PET",
    iconKey: "recycling",
    weightKg: 12.5,
    points: 1250,
    status: "success",
    type: "deposit",
  },
  {
    id: "TRX-9920108",
    date: "2024-10-24",
    timeLabel: "09:15 WIB",
    category: "Kertas & Karton",
    iconKey: "description",
    weightKg: 5.2,
    points: null,
    status: "pending",
    type: "deposit",
  },
  {
    id: "TRX-9920085",
    date: "2024-10-22",
    timeLabel: "16:45 WIB",
    category: "Logam/Aluminium",
    iconKey: "kitchen",
    weightKg: 3.0,
    points: 1000,
    status: "success",
    type: "deposit",
  },
  {
    id: "TRX-9920054",
    date: "2024-10-20",
    timeLabel: "11:00 WIB",
    category: "Kaca",
    iconKey: "wine_bar",
    weightKg: 8.7,
    points: 870,
    status: "success",
    type: "deposit",
  },
];

const mockRewards: Reward[] = [
  {
    id: "rwd_001",
    name: "Eco-Insulated Tumbler",
    description:
      "Vacuum insulated 750ml stainless steel. Dingin 24 jam / panas 12 jam.",
    pointCost: 2500,
    category: "Eco-Home",
    stock: 42,
    stockMax: 100,
    badge: "Best Seller",
  },
  {
    id: "rwd_002",
    name: "Heavyweight Totebag",
    description:
      "100% katun organik bersertifikat GOTS. Tali lebar, daya angkut kuat.",
    pointCost: 1200,
    category: "Accessories",
    stock: 128,
    stockMax: 150,
    badge: null,
  },
  {
    id: "rwd_003",
    name: "Recycled Tech Cap",
    description:
      "Dari 100% plastik PET daur ulang. Breathable, adjustable fit.",
    pointCost: 1800,
    category: "Apparel",
    stock: 5,
    stockMax: 40,
    badge: "Limited",
  },
];

const mockLocations: DropLocation[] = [
  {
    id: "loc_001",
    name: "Sudirman Green Hub",
    address: "Jl. Jend. Sudirman No. 45, Jakarta Pusat",
    distanceKm: 0.8,
    isOpen: true,
    openInfo: "Buka sampai 20:00",
    visitorsToday: 12,
    mapX: 45,
    mapY: 35,
  },
  {
    id: "loc_002",
    name: "Thamrin Eco Point",
    address: "Jl. MH Thamrin No. 12, Jakarta Pusat",
    distanceKm: 2.4,
    isOpen: false,
    openInfo: "Buka kembali besok, 08:00",
    visitorsToday: 0,
    mapX: 65,
    mapY: 55,
  },
  {
    id: "loc_003",
    name: "Kuningan Recycle",
    address: "Rasuna Said Tower B, Jakarta Selatan",
    distanceKm: 3.1,
    isOpen: true,
    openInfo: "Fasilitas ramah lingkungan lengkap",
    visitorsToday: 7,
    mapX: 25,
    mapY: 48,
  },
];

const mockNotifications: AppNotification[] = [
  {
    id: "ntf_001",
    iconKey: "check_circle",
    title: "Setoran berhasil divalidasi",
    body: "Setoran Plastik PET 12.5kg Anda mendapatkan 1.250 poin.",
    timeAgo: "5 menit lalu",
    group: "Terbaru",
    read: false,
  },
  {
    id: "ntf_002",
    iconKey: "redeem",
    title: "Penukaran reward diproses",
    body: "Eco-Insulated Tumbler Anda sedang disiapkan untuk pengiriman.",
    timeAgo: "2 jam lalu",
    group: "Terbaru",
    read: false,
  },
  {
    id: "ntf_003",
    iconKey: "eco",
    title: "Laporan hijau mingguan",
    body: "Anda mencegah 45kg CO2 minggu ini. Luar biasa!",
    timeAgo: "Kemarin, 09:00",
    group: "Kemarin",
    read: true,
  },
];

// ---------------------------------------------------------------------------
// AUTH (W1 - Login & Registrasi)
// ---------------------------------------------------------------------------

/**
 * TODO(API): POST {BASE_URL}/auth/login
 *   Body : { email: string, password: string }
 *   Resp : { token: string, user: User }
 *   Logic: simpan token -> setAuthToken(), lalu fetch dashboard.
 *   Error: 401 kredensial salah, 422 validasi gagal.
 */
export async function login(
  email: string,
  _password: string,
): Promise<AuthResponse> {
  await mockDelay();
  // REAL:
  // const res = await fetch(`${BASE_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, password: _password }),
  // });
  // if (!res.ok) throw new Error("Login gagal");
  // const data: AuthResponse = await res.json();
  // setAuthToken(data.token);
  // return data;
  return { token: "mock-token", user: { ...mockUser, email } };
}

/**
 * TODO(API): POST {BASE_URL}/auth/register
 *   Body : { full_name, email, phone, password, password_confirmation,
 *            address, accept_terms: boolean }
 *   Resp : { token: string, user: User }
 */
export async function register(payload: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
}): Promise<AuthResponse> {
  await mockDelay(1200);
  // REAL: kirim body di atas, parse token + user dari response.
  return {
    token: "mock-token",
    user: {
      ...mockUser,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    },
  };
}

/**
 * TODO(API): POST {BASE_URL}/auth/logout (header Authorization).
 */
export async function logout(): Promise<void> {
  await mockDelay(200);
  // REAL: await fetch(`${BASE_URL}/auth/logout`, { method: "POST", headers: authHeaders() });
  setAuthToken(null);
}

// ---------------------------------------------------------------------------
// DASHBOARD (W2 - Beranda)
// ---------------------------------------------------------------------------

/**
 * TODO(API): GET {BASE_URL}/dashboard (header Authorization)
 *   Resp : { point_balance, recent_transactions: Transaction[],
 *            popular_rewards: Reward[] }
 */
export async function getDashboard(): Promise<DashboardData> {
  await mockDelay();
  // REAL:
  // const res = await fetch(`${BASE_URL}/dashboard`, { headers: authHeaders() });
  // return (await res.json()) as DashboardData;
  return {
    pointBalance: mockUser.pointBalance,
    recentTransactions: mockTransactions.slice(0, 3),
    popularRewards: mockRewards.slice(0, 2),
  };
}

// ---------------------------------------------------------------------------
// LOCATIONS (W3 - Lokasi Posko)
// ---------------------------------------------------------------------------

/**
 * TODO(API): GET {BASE_URL}/locations?q={query}
 *   Resp : DropLocation[] (urut berdasarkan jarak terdekat).
 *   Catatan: ganti mapX/mapY dgn lat/lng asli + integrasi peta (mis. Mapbox/Leaflet).
 */
export async function getLocations(query = ""): Promise<DropLocation[]> {
  await mockDelay();
  // REAL:
  // const res = await fetch(`${BASE_URL}/locations?q=${encodeURIComponent(query)}`, { headers: authHeaders() });
  // return (await res.json()) as DropLocation[];
  if (!query) return mockLocations;
  const q = query.toLowerCase();
  return mockLocations.filter(
    (l) =>
      l.name.toLowerCase().includes(q) || l.address.toLowerCase().includes(q),
  );
}

// ---------------------------------------------------------------------------
// AI SCANNER (W4 - Setor Sampah AI)
// ---------------------------------------------------------------------------

/**
 * TODO(API): POST {BASE_URL}/waste/analyze  (multipart/form-data)
 *   Body : { image: File }
 *   Resp : ScanResult — hasil deteksi model AI.
 *   Logic: kirim foto, model mengembalikan produk, kategori, tag, confidence.
 */
export async function analyzeWaste(_image?: File): Promise<ScanResult> {
  await mockDelay(1500);
  // REAL:
  // const form = new FormData();
  // if (_image) form.append("image", _image);
  // const res = await fetch(`${BASE_URL}/waste/analyze`, {
  //   method: "POST",
  //   headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
  //   body: form,
  // });
  // return (await res.json()) as ScanResult;
  return {
    depositorName: mockUser.fullName,
    locationName: "Eco Central Hub",
    productName: "Botol Air Mineral PET 600ml",
    category: "Anorganik",
    tags: ["Plastik", "Botol Minuman", "Grade A"],
    confidence: 98,
  };
}

/**
 * Estimasi poin dari berat. Konstanta sama dengan mockup W4:
 *   1.000 gram = 2 poin  (0.002 poin/gram)
 * Ini perhitungan klien; backend boleh memvalidasi ulang saat submit.
 */
export function estimatePoints(grams: number): number {
  return Math.round(grams * 0.002 * 10) / 10;
}

/**
 * TODO(API): POST {BASE_URL}/deposits
 *   Body : { location_id, product_name, category, weight_grams }
 *   Resp : Transaction (status awal "pending" menunggu validasi admin).
 */
export async function submitDeposit(payload: {
  productName: string;
  category: string;
  weightGrams: number;
}): Promise<Transaction> {
  await mockDelay(1200);
  // REAL: POST body di atas, parse Transaction dari response.
  return {
    id: `TRX-${Math.floor(Math.random() * 9000000 + 1000000)}`,
    date: new Date().toISOString().slice(0, 10),
    timeLabel: "Baru saja",
    category: payload.category,
    iconKey: "recycling",
    weightKg: payload.weightGrams / 1000,
    points: null,
    status: "pending",
    type: "deposit",
  };
}

// ---------------------------------------------------------------------------
// TRANSACTIONS (W5 - Riwayat Transaksi)
// ---------------------------------------------------------------------------

/**
 * TODO(API): GET {BASE_URL}/transactions?type={all|deposit|redeem}&page={n}
 *   Resp : { data: Transaction[], total: number, page: number }
 */
export async function getTransactions(
  filter: "all" | "deposit" | "redeem" = "all",
): Promise<Transaction[]> {
  await mockDelay();
  // REAL:
  // const res = await fetch(`${BASE_URL}/transactions?type=${filter}`, { headers: authHeaders() });
  // return (await res.json()).data as Transaction[];
  if (filter === "all") return mockTransactions;
  return mockTransactions.filter((t) => t.type === filter);
}

// ---------------------------------------------------------------------------
// REWARDS (W6 - Reward Catalog)
// ---------------------------------------------------------------------------

/**
 * TODO(API): GET {BASE_URL}/rewards?category={category}
 *   Resp : Reward[]
 */
export async function getRewards(category = "All"): Promise<Reward[]> {
  await mockDelay();
  // REAL:
  // const res = await fetch(`${BASE_URL}/rewards?category=${category}`, { headers: authHeaders() });
  // return (await res.json()) as Reward[];
  if (category === "All") return mockRewards;
  return mockRewards.filter((r) => r.category === category);
}

/**
 * TODO(API): POST {BASE_URL}/rewards/{id}/redeem
 *   Resp : { success: boolean, new_balance: number }
 *   Error: 409 stok habis, 402 poin tidak cukup.
 */
export async function redeemReward(
  _rewardId: string,
): Promise<{ success: boolean; newBalance: number }> {
  await mockDelay(1000);
  // REAL: POST ke endpoint redeem, parse new_balance dari response.
  return { success: true, newBalance: mockUser.pointBalance };
}

// ---------------------------------------------------------------------------
// NOTIFICATIONS (W8)
// ---------------------------------------------------------------------------

/**
 * TODO(API): GET {BASE_URL}/notifications
 *   Resp : AppNotification[]
 */
export async function getNotifications(): Promise<AppNotification[]> {
  await mockDelay();
  // REAL: const res = await fetch(`${BASE_URL}/notifications`, { headers: authHeaders() });
  return mockNotifications;
}

// ---------------------------------------------------------------------------
// CUSTOMER SERVICE (W9)
// ---------------------------------------------------------------------------

/**
 * TODO(API): POST {BASE_URL}/support/messages
 *   Body : { message: string, history: ChatMessage[] }
 *   Resp : ChatMessage (balasan dari bot/agen).
 *   Logic: bisa diarahkan ke chatbot AI atau agen manusia.
 */
export async function sendSupportMessage(
  message: string,
  _history: ChatMessage[] = [],
): Promise<ChatMessage> {
  await mockDelay(1200);
  // REAL: POST body di atas, parse ChatMessage dari response.
  return {
    id: `msg_${Date.now()}`,
    sender: "agent",
    senderName: "Sarah",
    text: `Terima kasih atas pesan Anda: "${message}". Tim kami akan segera membantu memeriksa hal ini untuk Anda.`,
    timeLabel: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function initialSupportMessages(): ChatMessage[] {
  return [
    {
      id: "msg_init_1",
      sender: "bot",
      senderName: "Lumina Bot",
      text: "Halo! Saya Lumina Bot. Ada yang bisa saya bantu hari ini terkait perbankan berkelanjutan Anda?",
      timeLabel: "09:15",
    },
    {
      id: "msg_init_2",
      sender: "agent",
      senderName: "Sarah",
      text: "Selamat pagi! Saya Sarah dari tim Customer Service Smart Eco Bank. Mari kita selesaikan bersama.",
      timeLabel: "09:17",
    },
  ];
}
