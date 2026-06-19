"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { getAdminRewardOrders, updateRewardOrderStatus } from "@/lib/adminApi";
import type { AdminRewardOrder, RewardOrderStatus } from "@/lib/adminTypes";

const STATUS_CONFIG: Record<RewardOrderStatus, { label: string; icon: string; color: string; badge: string }> = {
  menunggu: { label: "Menunggu Dikemas", icon: "pending_actions", color: "text-tertiary", badge: "bg-tertiary-container/30 text-tertiary" },
  dikemas:  { label: "Sedang Dikemas",   icon: "inventory_2",      color: "text-secondary", badge: "bg-secondary-container/30 text-secondary" },
  pengiriman: { label: "Dikirim",        icon: "local_shipping",   color: "text-primary",   badge: "bg-primary-container/20 text-primary" },
  selesai:  { label: "Selesai",          icon: "check_circle",     color: "text-[#0f5132]", badge: "bg-[#d1e7dd] text-[#0f5132]" },
};

const NEXT_STATUS: Partial<Record<RewardOrderStatus, "dikemas" | "pengiriman">> = {
  menunggu: "dikemas",
  dikemas: "pengiriman",
};

const NEXT_LABEL: Partial<Record<RewardOrderStatus, string>> = {
  menunggu: "Proses Kemas",
  dikemas: "Kirim Sekarang",
};

function StatusBadge({ status }: { status: RewardOrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
      <Icon name={cfg.icon} fill style={{ fontSize: 13 }} />
      {cfg.label}
    </span>
  );
}

export default function AdminRewardsPage() {
  const [orders, setOrders] = useState<AdminRewardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RewardOrderStatus | "all">("all");
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getAdminRewardOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleAdvance(order: AdminRewardOrder) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setProcessing(order.id);
    try {
      await updateRewardOrderStatus(order.id, next);
      setOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, status: next } : o),
      );
      showToast(`Pesanan #${order.id} diperbarui ke "${STATUS_CONFIG[next].label}"`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal memperbarui status", "error");
    } finally {
      setProcessing(null);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const FILTERS: { key: RewardOrderStatus | "all"; label: string }[] = [
    { key: "all", label: `Semua (${orders.length})` },
    { key: "menunggu", label: `Menunggu (${counts.menunggu ?? 0})` },
    { key: "dikemas", label: `Dikemas (${counts.dikemas ?? 0})` },
    { key: "pengiriman", label: `Pengiriman (${counts.pengiriman ?? 0})` },
    { key: "selesai", label: `Selesai (${counts.selesai ?? 0})` },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-10 py-4 bg-surface border-b border-surface-variant">
        <div>
          <h1 className="text-headline-md font-headline-md font-bold text-primary">Pesanan Reward</h1>
          <p className="text-label-sm font-label-sm text-on-surface-variant hidden md:block">
            Kelola status penukaran poin nasabah
          </p>
        </div>
        {(counts.menunggu ?? 0) + (counts.dikemas ?? 0) > 0 && (
          <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-label-sm font-bold">
            {(counts.menunggu ?? 0) + (counts.dikemas ?? 0)} Perlu Tindakan
          </span>
        )}
      </header>

      <div className="flex-1 px-4 md:px-10 py-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-on-surface">Daftar Pesanan</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Update status dari <strong>Menunggu → Dikemas → Pengiriman</strong>. Status Selesai diupdate otomatis saat nasabah konfirmasi.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {(["menunggu", "dikemas", "pengiriman", "selesai"] as RewardOrderStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3">
                <Icon name={cfg.icon} fill className={cfg.color} style={{ fontSize: 22 }} />
                <div>
                  <p className="text-xs text-outline font-bold uppercase tracking-wide">{cfg.label}</p>
                  <p className="text-xl font-bold text-on-surface">{counts[s] ?? 0}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Mobile cards */}
        {!loading && (
          <div className="md:hidden space-y-3 mb-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <Icon name="inventory_2" style={{ fontSize: 48 }} className="opacity-30 mb-2" />
                <p>Tidak ada pesanan.</p>
              </div>
            ) : filtered.map((order) => (
              <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-on-surface text-sm">{order.userName}</p>
                    <p className="text-xs text-outline">#{order.id} · {order.createdAt}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-on-surface">{order.rewardName}</p>
                    <p className="text-xs text-on-surface-variant">{order.qty}× · {order.pointPerItem.toLocaleString("id-ID")} pts/item</p>
                  </div>
                </div>
                {NEXT_STATUS[order.status] && (
                  <button
                    onClick={() => handleAdvance(order)}
                    disabled={processing === order.id}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:brightness-95 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {processing === order.id ? (
                      <Icon name="sync" className="animate-spin" style={{ fontSize: 16 }} />
                    ) : (
                      <Icon name="arrow_forward" style={{ fontSize: 16 }} />
                    )}
                    {NEXT_LABEL[order.status]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop table */}
        <div className="hidden md:block bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {["#", "Nasabah", "Produk Reward", "Qty / Poin", "Status", "Dibuat", "Aksi"].map((h) => (
                    <th key={h} className="px-5 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                      Memuat data…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-on-surface-variant">
                      <Icon name="inventory_2" style={{ fontSize: 48 }} className="opacity-30 mb-2" />
                      <p>Tidak ada pesanan untuk filter ini.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-bright transition-colors">
                      <td className="px-5 py-4 text-xs font-bold text-outline">#{order.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-on-surface text-sm">{order.userName}</p>
                        <p className="text-xs text-outline">{order.userPhone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-on-surface text-sm">{order.rewardName}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-on-surface">{order.qty}×</p>
                        <p className="text-xs text-primary font-bold">{order.totalPoints.toLocaleString("id-ID")} pts</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant">{order.createdAt}</td>
                      <td className="px-5 py-4">
                        {NEXT_STATUS[order.status] ? (
                          <button
                            onClick={() => handleAdvance(order)}
                            disabled={processing === order.id}
                            className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:brightness-95 active:scale-95 transition-all disabled:opacity-60"
                          >
                            {processing === order.id ? (
                              <Icon name="sync" className="animate-spin" style={{ fontSize: 14 }} />
                            ) : (
                              <Icon name="arrow_forward" style={{ fontSize: 14 }} />
                            )}
                            {NEXT_LABEL[order.status]}
                          </button>
                        ) : (
                          <span className="text-xs text-outline italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <div className={`${toast.type === "error" ? "bg-error-container border border-error/20" : "bg-on-background"} rounded-xl px-5 py-4 shadow-xl flex items-center gap-3`}>
            <Icon
              name={toast.type === "error" ? "error" : "check_circle"}
              fill
              className={toast.type === "error" ? "text-error" : "text-primary-fixed"}
            />
            <p className={`text-sm font-medium ${toast.type === "error" ? "text-error" : "text-surface"}`}>{toast.msg}</p>
          </div>
        </div>
      )}
    </>
  );
}
