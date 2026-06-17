"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { getRewards, redeemReward } from "@/lib/api";
import type { Reward } from "@/lib/types";

const CATEGORIES = ["All", "Accessories", "Apparel", "Eco-Home"];
const BALANCE = 12450;

export default function RewardsPage() {
  const [category, setCategory] = useState("All");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeeming, setRedeeming] = useState<Reward | null>(null);
  const [success, setSuccess] = useState<Reward | null>(null);

  useEffect(() => {
    getRewards(category).then(setRewards);
  }, [category]);

  async function confirmRedeem() {
    if (!redeeming) return;
    const r = redeeming;
    setRedeeming(null);
    await redeemReward(r.id);
    setSuccess(r);
  }

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
        {/* Hero */}
        <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="text-label-sm font-label-sm text-primary tracking-widest">
              ECO-LOYALTY PROGRAM
            </span>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">
              Tukarkan Dampak Anda
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              Tukarkan poin keberlanjutan Anda dengan produk ramah lingkungan
              eksklusif. Setiap reward berkontribusi pada planet yang lebih
              bersih.
            </p>
          </div>
          <div className="bg-primary-container p-6 rounded-xl flex items-center gap-4 shadow-sm border border-primary/10">
            <div className="bg-on-primary-container p-3 rounded-full">
              <Icon
                name="energy_savings_leaf"
                fill
                className="text-surface"
              />
            </div>
            <div>
              <p className="text-label-sm font-label-sm text-on-primary-container opacity-80">
                Poin Tersedia
              </p>
              <p className="text-headline-md font-headline-md text-on-primary-container">
                {BALANCE.toLocaleString("id-ID")} pts
              </p>
            </div>
          </div>
        </section>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-stack-lg overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-button font-button transition-colors ${
                category === c
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
              }`}
            >
              {c === "All" ? "Semua Reward" : c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {rewards.map((r) => {
            const stockPct = Math.round((r.stock / r.stockMax) * 100);
            const lowStock = stockPct < 20;
            const affordable = BALANCE >= r.pointCost;
            return (
              <article
                key={r.id}
                className="group bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden eco-gradient flex items-center justify-center">
                  <Icon
                    name="redeem"
                    fill
                    className="text-white/90 transition-transform group-hover:scale-110"
                    style={{ fontSize: 96 }}
                  />
                  {r.badge && (
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${
                          r.badge === "Limited"
                            ? "bg-error text-on-error"
                            : "bg-primary text-on-primary"
                        }`}
                      >
                        {r.badge}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-headline-md font-headline-md text-on-surface">
                      {r.name}
                    </h3>
                    <span className="text-primary font-bold text-lg whitespace-nowrap">
                      {r.pointCost.toLocaleString("id-ID")} pts
                    </span>
                  </div>
                  <p className="text-body-md font-body-md text-on-surface-variant mb-6 line-clamp-2">
                    {r.description}
                  </p>
                  <div className="mt-auto space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-label-sm font-label-sm">
                        <span
                          className={
                            lowStock
                              ? "text-error font-bold"
                              : "text-on-surface-variant"
                          }
                        >
                          {lowStock ? "Stok menipis!" : "Stok tersedia"}
                        </span>
                        <span className="text-on-surface font-bold">
                          {r.stock} unit
                        </span>
                      </div>
                      <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${lowStock ? "bg-error" : "bg-primary"}`}
                          style={{ width: `${stockPct}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setRedeeming(r)}
                      disabled={!affordable}
                      className="w-full py-4 bg-primary text-on-primary rounded-xl font-button text-button hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="redeem" />
                      {affordable ? "Tukarkan Poin" : "Poin Tidak Cukup"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Confirm dialog */}
      {redeeming && (
        <Dialog onClose={() => setRedeeming(null)}>
          <Icon
            name="help"
            className="text-primary mx-auto"
            style={{ fontSize: 48 }}
          />
          <h3 className="text-headline-md font-headline-md mt-4">
            Tukarkan {redeeming.name}?
          </h3>
          <p className="text-body-md text-on-surface-variant mt-2">
            {redeeming.pointCost.toLocaleString("id-ID")} poin akan dipotong dari
            saldo Anda.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setRedeeming(null)}
              className="flex-1 py-3 border border-outline rounded-xl font-button hover:bg-surface-variant transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmRedeem}
              className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-button hover:brightness-95 transition-all"
            >
              Ya, Tukarkan
            </button>
          </div>
        </Dialog>
      )}

      {/* Success dialog */}
      {success && (
        <Dialog onClose={() => setSuccess(null)}>
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container mx-auto">
            <Icon name="check_circle" fill style={{ fontSize: 40 }} />
          </div>
          <h3 className="text-headline-md font-headline-md mt-4 text-primary">
            Penukaran Berhasil!
          </h3>
          <p className="text-body-md text-on-surface-variant mt-2">
            {success.name} telah ditukarkan. Cek email untuk detail pengiriman.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="w-full mt-6 py-3 bg-primary text-on-primary rounded-xl font-button hover:brightness-95 transition-all"
          >
            Selesai
          </button>
        </Dialog>
      )}
    </AppShell>
  );
}

function Dialog({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
