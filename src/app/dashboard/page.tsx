"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { getDashboard } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import type { DashboardData } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast, showToast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => showToast(e instanceof Error ? e.message : "Gagal memuat dashboard", "error"));
  }, [showToast]);

  const balance = user?.pointBalance ?? 0;

  return (
    <AppShell>
      {toast && <Toast {...toast} />}
      <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg space-y-stack-lg">
        {/* Hero */}
        <section className="eco-gradient rounded-[2rem] p-stack-lg md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none rotate-12">
            <Icon name="eco" fill style={{ fontSize: 320 }} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-stack-lg">
            <div className="text-center md:text-left">
              <p className="text-primary-fixed font-label-sm text-label-sm uppercase tracking-widest mb-2">
                Sustainable Balance
              </p>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-primary mb-2">
                Saldo Poin: {balance.toLocaleString("id-ID")} Pts
              </h2>
              <p className="text-on-primary/80 font-body-md text-body-md max-w-md">
                Setara Rp {(balance * 10).toLocaleString("id-ID")}. Kumpulkan
                poin dari setiap sampah dan tukarkan dengan hadiah menarik.
              </p>
            </div>
            <Link
              href="/scanner"
              className="group flex items-center gap-4 bg-surface-container-lowest hover:bg-primary-container text-primary px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-4 border-primary/20"
            >
              <Icon
                name="recycling"
                fill
                className="transition-transform group-hover:rotate-12"
                style={{ fontSize: 40 }}
              />
              <div className="flex flex-col items-start">
                <span className="text-headline-md font-headline-md leading-tight">
                  SETOR SAMPAH
                </span>
                <span className="text-label-sm font-label-sm opacity-60">
                  Ubah Sampah Jadi Berkah
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Recent activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-headline-md">
                Aktivitas Terakhir
              </h3>
              <Link
                href="/history"
                className="text-primary font-button text-button hover:underline"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
              {!data ? (
                <div className="p-12 text-center text-on-surface-variant">
                  Memuat aktivitas…
                </div>
              ) : data.recentTransactions.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
                    <Icon name="history" className="text-3xl" />
                  </div>
                  <p className="text-on-surface-variant">
                    Belum ada aktivitas transaksi.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile: card list */}
                  <div className="md:hidden divide-y divide-outline-variant">
                    {data.recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                          <Icon name={t.iconKey} fill className="text-base" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm text-on-surface truncate">{t.category}</span>
                            <span className="font-bold text-primary text-sm shrink-0">
                              {t.points ? `+${t.points.toLocaleString("id-ID")}` : "—"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-label-sm text-on-surface-variant">{t.date}</span>
                            <StatusBadge status={t.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          {["Tanggal", "Kategori", "Berat", "Poin", "Status"].map((h) => (
                            <th key={h} className="px-4 py-4 text-label-sm font-label-sm text-on-surface-variant uppercase">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {data.recentTransactions.map((t) => (
                          <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-4 py-4 text-body-md">{t.date}</td>
                            <td className="px-4 py-4 text-body-md">{t.category}</td>
                            <td className="px-4 py-4 text-body-md">{t.weightGram != null ? `${t.weightGram} g` : "—"}</td>
                            <td className="px-4 py-4 font-bold text-primary-container">
                              {t.points ? `+${t.points.toLocaleString("id-ID")}` : "—"}
                            </td>
                            <td className="px-4 py-4"><StatusBadge status={t.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Popular rewards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-headline-md">
                Katalog Terpopuler
              </h3>
              <Link
                href="/rewards"
                className="text-primary text-label-sm font-label-sm hover:underline"
              >
                Semua
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {(data?.popularRewards ?? []).map((r) => (
                <div
                  key={r.id}
                  className="group bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-32 relative overflow-hidden eco-gradient flex items-center justify-center">
                    <Icon
                      name="redeem"
                      fill
                      className="text-white/90"
                      style={{ fontSize: 56 }}
                    />
                    <div className="absolute top-2 right-2 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                      {r.pointCost.toLocaleString("id-ID")} Pts
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline-md text-body-md mb-1">
                      {r.name}
                    </h4>
                    <p className="text-label-sm font-label-sm text-on-surface-variant line-clamp-1">
                      {r.description}
                    </p>
                    <Link
                      href="/rewards"
                      className="mt-4 block text-center w-full py-2 bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant rounded-lg font-button text-label-sm transition-colors"
                    >
                      Tukarkan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: import("@/lib/types").TxStatus }) {
  if (status === "success")
    return (
      <span className="px-3 py-1 bg-[#d1e7dd] text-[#0f5132] rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="check_circle" className="text-[14px]" /> Sukses
      </span>
    );
  if (status === "pending")
    return (
      <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="pending" className="text-[14px]" /> Menunggu
      </span>
    );
  if (status === "process")
    return (
      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="autorenew" className="text-[14px]" /> Diproses
      </span>
    );
  return (
    <span className="px-3 py-1 bg-error-container text-error rounded-full text-label-sm font-bold inline-flex items-center gap-1 w-fit">
      <Icon name="cancel" className="text-[14px]" /> Gagal
    </span>
  );
}
