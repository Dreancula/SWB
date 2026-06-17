"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { getTransactions } from "@/lib/api";
import type { Transaction } from "@/lib/types";

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "deposit", label: "Setoran" },
  { key: "redeem", label: "Tukar" },
] as const;

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "deposit" | "redeem">("all");
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTransactions(filter).then((data) => {
      setTxs(data);
      setLoading(false);
    });
  }, [filter]);

  const totalPoints = txs.reduce((sum, t) => sum + (t.points ?? 0), 0);

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md mb-stack-lg">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-2">
              Riwayat Transaksi
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              Pantau kontribusi ekologis Anda. Setiap kilogram sampah tervalidasi
              dikonversi menjadi poin loyalitas hijau.
            </p>
          </div>
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              placeholder="Cari ID atau Kategori..."
              className="pl-10 pr-4 py-2 bg-surface-container border-none rounded-xl text-body-md focus:ring-2 focus:ring-primary w-full md:w-64 outline-none"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-stack-sm mb-stack-md flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2 rounded-full text-button font-button transition-colors ${
                filter === f.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant border-b border-surface-variant">
                  {["Tanggal", "ID Transaksi", "Kategori", "Berat", "Poin", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 font-button text-label-sm uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-on-surface-variant"
                    >
                      Memuat transaksi…
                    </td>
                  </tr>
                ) : txs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-on-surface-variant"
                    >
                      Belum ada transaksi untuk filter ini.
                    </td>
                  </tr>
                ) : (
                  txs.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-body-md font-bold">{t.date}</span>
                          <span className="text-label-sm text-on-surface-variant">
                            {t.timeLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-label-sm font-label-sm text-primary">
                        {t.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Icon name={t.iconKey} className="text-secondary" />
                          <span className="text-body-md">{t.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-headline-md text-primary">
                        {t.weightKg ?? "—"}
                        {t.weightKg && (
                          <span className="text-label-sm font-normal text-on-surface-variant">
                            {" "}
                            kg
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 font-bold text-primary-container">
                        {t.points
                          ? `+${t.points.toLocaleString("id-ID")} Pts`
                          : "—"}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <span className="text-label-sm text-on-surface-variant">
              Menampilkan {txs.length} transaksi
            </span>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant opacity-50">
                <Icon name="chevron_left" />
              </button>
              <button className="px-3 py-1 rounded-lg bg-primary text-on-primary text-label-sm font-bold">
                1
              </button>
              <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-variant transition-all">
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>

        {/* Impact summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-lg">
          <div className="md:col-span-1 bg-primary-container/10 p-6 rounded-xl border border-primary/20 relative overflow-hidden">
            <h3 className="text-body-md font-bold text-primary mb-2">
              Total Poin Terkumpul
            </h3>
            <div className="text-headline-lg font-headline-lg text-primary">
              {totalPoints.toLocaleString("id-ID")} Pts
            </div>
            <p className="text-label-sm text-on-surface-variant mt-2">
              Tukarkan dengan voucher listrik atau diskon eco-store.
            </p>
            <Icon
              name="savings"
              className="absolute -right-4 -bottom-4 opacity-10 text-primary"
              style={{ fontSize: 120 }}
            />
          </div>
          <div className="md:col-span-2 bg-surface-container-low p-6 rounded-xl border border-surface-variant flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-28 h-28 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="#e1e3e4"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="#006d37"
                  strokeWidth="12"
                  strokeDasharray="364.42"
                  strokeDashoffset="91.1"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-headline-md font-headline-md text-primary">
                  75%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-body-lg font-headline-md text-on-surface mb-2">
                Target Emisi Karbon Mingguan
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Anda membantu mencegah pelepasan 45kg CO2 ke atmosfer minggu
                ini. Luar biasa!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "success" | "pending" | "failed" }) {
  if (status === "success")
    return (
      <span className="px-3 py-1 bg-[#d1e7dd] text-[#0f5132] rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="check_circle" className="text-[14px]" /> Sukses
      </span>
    );
  if (status === "pending")
    return (
      <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="pending" className="text-[14px]" /> Menunggu Validasi
      </span>
    );
  return (
    <span className="px-3 py-1 bg-error-container text-error rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
      <Icon name="cancel" className="text-[14px]" /> Gagal
    </span>
  );
}
