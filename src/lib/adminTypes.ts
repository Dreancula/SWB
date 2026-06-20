export type VerificationStatus = "pending" | "approved" | "completed" | "rejected";

export interface AdminVerification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  categoryId: number;
  categoryName: string;
  locationName: string;
  locationAddress: string;
  photoPath: string | null;
  weightGram: number;
  earnedPoints: number;
  aiCategory: string;
  aiMessage: string;
  status: VerificationStatus;
  submittedAt: string;
  confidence: number;
  rejectionReason?: string | null;
}

export interface AdminCategory {
  id: number;
  name: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  stock: number;
  pointCost: number;
  imageUrl?: string | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  color: "primary" | "secondary" | "tertiary";
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  points: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  photoUrl?: string | null;
  hasPin?: boolean;
  activityLogs?: ActivityLog[] | null;
}

export interface AdminChatSession {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export type RewardOrderStatus = "menunggu" | "dikemas" | "pengiriman" | "selesai";

export interface AdminRewardOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  rewardName: string;
  qty: number;
  pointPerItem: number;
  totalPoints: number;
  status: RewardOrderStatus;
  createdAt: string;
}
