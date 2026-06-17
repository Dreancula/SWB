// ============================================================================
// Tipe data domain (sesuai field yang muncul di mockup W1-W10).
// Setiap tipe punya bentuk yang sama dengan response API yang diharapkan,
// sehingga saat backend siap, JSON tinggal di-cast ke tipe ini.
// ============================================================================

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string | null;
  pointBalance: number; // saldo poin
  greenLevel: string; // mis. "Level 4: Green Hero"
  co2SavedKg: number;
}

export type TxStatus = "success" | "pending" | "failed";
export type TxType = "deposit" | "redeem";

export interface Transaction {
  id: string; // mis. "TRX-9920110"
  date: string; // ISO date
  timeLabel: string; // mis. "14:20 WIB"
  category: string; // mis. "Plastik PET"
  iconKey: string; // material symbol key
  weightKg: number | null;
  points: number | null; // null untuk pending
  status: TxStatus;
  type: TxType;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  category: string; // Accessories | Apparel | Eco-Home
  stock: number;
  stockMax: number;
  badge: string | null; // "Best Seller" | "Limited" | null
}

export interface DropLocation {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  isOpen: boolean;
  openInfo: string; // mis. "Open until 20:00"
  visitorsToday: number;
  // koordinat relatif (0-100) untuk simulasi peta; ganti dgn lat/lng asli nanti
  mapX: number;
  mapY: number;
}

export interface ScanResult {
  depositorName: string;
  locationName: string;
  productName: string;
  category: string; // mis. "Anorganik"
  tags: string[]; // mis. ["Plastik", "Botol Minuman", "Grade A"]
  confidence: number; // 0-100
}

export interface DashboardData {
  pointBalance: number;
  recentTransactions: Transaction[];
  popularRewards: Reward[];
}

export type ChatSender = "bot" | "agent" | "user";

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  senderName: string;
  text: string;
  timeLabel: string;
}

export interface AppNotification {
  id: string;
  iconKey: string;
  title: string;
  body: string;
  timeAgo: string;
  group: "Terbaru" | "Kemarin";
  read: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
