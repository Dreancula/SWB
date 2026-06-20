"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { confirmDelivery, getRewardOrderDetail } from "@/lib/api";
import type { RewardTrackingItem } from "@/lib/api";
import type { Transaction, ShippingStatus } from "@/lib/types";

const STEP_ORDER: ShippingStatus[] = ["diproses", "dikirim", "sampai"];

function stepIndex(s: ShippingStatus) {
  return STEP_ORDER.indexOf(s);
}

// ── Status badge ─────────────────────────────────────────────────────────────
function TxStatusBadge({ status }: { status: Transaction["status"] }) {
  const { t } = useTranslation();
  if (status === "success" || status === "completed" || status === "selesai")
    return (
      <span className="px-3 py-1 bg-[#d1e7dd] text-[#0f5132] rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1">
        <Icon name="check_circle" className="text-sm" /> {t("status.success")}
      </span>
    );
  if (status === "pending")
    return (
      <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1">
        <Icon name="pending" className="text-sm" /> {t("status.pending")}
      </span>
    );
  if (status === "process")
    return (
      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="autorenew" className="text-sm" /> {t("status.process")}
      </span>
    );
  if (status === "dikemas")
    return (
      <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="inventory_2" className="text-sm" /> {t("status.packed")}
      </span>
    );
  if (status === "pengiriman")
    return (
      <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1 w-fit">
        <Icon name="local_shipping" className="text-sm" /> {t("status.shipped")}
      </span>
    );
  return (
    <span className="px-3 py-1 bg-error-container text-error rounded-full text-label-sm font-label-sm font-bold inline-flex items-center gap-1">
      <Icon name="cancel" className="text-sm" /> {t("status.failed")}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const SHIPPING_STEPS: {
    key: ShippingStatus;
    label: string;
    sublabel: string;
    icon: string;
  }[] = [
    {
      key: "diproses" as ShippingStatus,
      label: t("historyDetail.stepProcessed"),
      sublabel: t("historyDetail.stepProcessedSub"),
      icon: "inventory_2",
    },
    {
      key: "dikirim" as ShippingStatus,
      label: t("historyDetail.stepShipped"),
      sublabel: t("historyDetail.stepShippedSub"),
      icon: "local_shipping",
    },
    {
      key: "sampai" as ShippingStatus,
      label: t("historyDetail.stepDelivered"),
      sublabel: t("historyDetail.stepDeliveredSub"),
      icon: "home",
    },
  ];

  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState<ShippingStatus>("diproses");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [trackingItems, setTrackingItems] = useState<RewardTrackingItem[]>([]);

  useEffect(() => {
    let txData: Transaction | null = null;
    try {
      const raw = sessionStorage.getItem(`eco_tx_${id}`);
      if (raw) {
        txData = JSON.parse(raw) as Transaction;
        setTx(txData);
        if (txData.shippingStatus) setShipping(txData.shippingStatus);
      }
    } catch { }

    if (txData?.type === "redeem") {
      getRewardOrderDetail(id)
        .then(({ status, tracking }) => {
          if (tracking.length > 0) setTrackingItems(tracking);
          const s = status;
          if (s === "pengiriman") setShipping("dikirim");
          else if (s === "selesai") setShipping("sampai");
          else setShipping("diproses");
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  async function handleConfirm() {
    setConfirming(true);
    await confirmDelivery(id);
    setShipping("sampai");
    setConfirmed(true);
    setConfirming(false);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-on-surface-variant">
            <Icon name="sync" className="animate-spin text-primary" style={{ fontSize: 40 }} />
            <p className="text-body-md">{t("historyDetail.loadingDetail")}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!tx) {
    return (
      <AppShell>
        <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Icon name="search_off" className="text-on-surface-variant" style={{ fontSize: 64 }} />
          <p className="text-headline-md font-headline-md text-on-surface-variant">
            {t("historyDetail.notFound")}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-button hover:brightness-95 transition-all"
          >
            {t("common.back")}
          </button>
        </div>
      </AppShell>
    );
  }

  const isRedeem = tx.type === "redeem";

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-container-padding-desktop py-4 md:py-stack-lg space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-button"
        >
          <Icon name="arrow_back" />
          {t("historyDetail.backLink")}
        </button>

        {/* Header card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-4 md:p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isRedeem ? "eco-gradient text-white" : "bg-primary-container text-on-primary-container"}`}>
                <Icon name={isRedeem ? "redeem" : tx.iconKey} fill style={{ fontSize: 24 }} />
              </div>
              <div>
                <p className="font-body-md font-bold text-on-surface text-lg leading-snug">
                  {isRedeem ? (tx.rewardName ?? t("historyDetail.defaultRewardName")) : tx.category}
                </p>
                <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded-full ${isRedeem ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container/20 text-primary"}`}>
                  {isRedeem ? t("historyDetail.typeRedeem") : t("historyDetail.typeDeposit")}
                </span>
              </div>
            </div>
            <TxStatusBadge status={tx.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant sm:grid-cols-4">
            <InfoCell label={t("historyDetail.labelTxId")} value={tx.id} mono />
            <InfoCell label={t("historyDetail.labelDate")} value={tx.date} />
            <InfoCell label={t("historyDetail.labelTime")} value={tx.timeLabel} />
            {isRedeem ? (
              <InfoCell
                label={t("historyDetail.labelPointsUsed")}
                value={`${Math.abs(tx.points ?? 0).toLocaleString("id-ID")} pts`}
                accent
              />
            ) : (
              <InfoCell
                label={t("historyDetail.labelPointsEarned")}
                value={tx.points ? `+${tx.points.toLocaleString("id-ID")} pts` : "—"}
                accent={!!tx.points}
              />
            )}
          </div>
        </div>

        {/* ── Redeem detail ── */}
        {isRedeem && (
          <>
            {/* Order info */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-4">
              <h2 className="font-body-md font-bold text-on-surface text-lg flex items-center gap-2">
                <Icon name="inventory_2" className="text-secondary" />
                {t("historyDetail.orderDetail")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <InfoCell label={t("historyDetail.labelProductName")} value={tx.rewardName ?? "—"} />
                <InfoCell label={t("historyDetail.labelPointPerItem")} value={tx.pointPerItem ? `${tx.pointPerItem.toLocaleString("id-ID")} pts` : "—"} />
                <InfoCell label={t("historyDetail.labelQty")} value={`${tx.qty ?? 1} unit`} />
                <InfoCell label={t("historyDetail.labelTotalPoints")} value={`${Math.abs(tx.points ?? 0).toLocaleString("id-ID")} pts`} accent />
              </div>
            </div>

            {/* Shipping tracker */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-6">
              <h2 className="font-body-md font-bold text-on-surface text-lg flex items-center gap-2">
                <Icon name="local_shipping" className="text-secondary" />
                {t("historyDetail.shippingTracker")}
              </h2>

              <div className="relative">
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-outline-variant" />

                <div className="space-y-0">
                  {trackingItems.length > 0 ? (
                    // API tracking data — sorted oldest→newest
                    [...trackingItems]
                      .sort((a, b) => {
                        const ORDER: Record<string, number> = { process: 1, menunggu: 1, dikemas: 2, pengiriman: 3, selesai: 4 };
                        return (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9);
                      })
                      .map((item, i, arr) => {
                        const isLast = i === arr.length - 1;
                        const done = item.is_completed || confirmed;
                        const active = isLast && done && !confirmed;
                        return (
                          <div key={item.status + i} className="flex gap-4 items-start pb-8 last:pb-0 relative">
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              done
                                ? active ? "bg-primary text-on-primary ring-4 ring-primary/20" : "bg-primary text-on-primary"
                                : "bg-surface border-2 border-outline-variant text-on-surface-variant"
                            }`}>
                              {done && !active
                                ? <Icon name="check" style={{ fontSize: 18 }} />
                                : <Icon name={item.status === "pengiriman" ? "local_shipping" : item.status === "selesai" ? "home" : "inventory_2"} fill={done} style={{ fontSize: 18 }} />
                              }
                            </div>
                            <div className="flex-grow pt-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={`font-body-md font-bold ${done ? "text-on-surface" : "text-on-surface-variant"}`}>
                                  {item.label}
                                </p>
                                {active && <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-label-sm">Aktif</span>}
                                {item.status === "selesai" && confirmed && <span className="px-2 py-0.5 bg-[#d1e7dd] text-[#0f5132] rounded-full text-label-sm font-label-sm">Selesai</span>}
                              </div>
                              <p className={`text-label-sm font-label-sm mt-0.5 ${done ? "text-on-surface-variant" : "text-outline"}`}>
                                {item.description}
                              </p>
                              {item.is_completed && item.date && (
                                <p className="text-xs text-outline mt-1">{item.date}</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    // Fallback — hardcoded steps
                    SHIPPING_STEPS.map((step, i) => {
                      const currentIdx = stepIndex(shipping);
                      const done = i <= currentIdx;
                      const active = i === currentIdx;
                      return (
                        <div key={step.key} className="flex gap-4 items-start pb-8 last:pb-0 relative">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            done
                              ? active ? "bg-primary text-on-primary ring-4 ring-primary/20" : "bg-primary text-on-primary"
                              : "bg-surface border-2 border-outline-variant text-on-surface-variant"
                          }`}>
                            {done && !active ? <Icon name="check" style={{ fontSize: 18 }} /> : <Icon name={step.icon} fill={done} style={{ fontSize: 18 }} />}
                          </div>
                          <div className="flex-grow pt-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-body-md font-bold ${done ? "text-on-surface" : "text-on-surface-variant"}`}>{step.label}</p>
                              {active && !confirmed && <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full text-label-sm font-label-sm">Aktif</span>}
                              {step.key === "sampai" && confirmed && <span className="px-2 py-0.5 bg-[#d1e7dd] text-[#0f5132] rounded-full text-label-sm font-label-sm">Selesai</span>}
                            </div>
                            <p className={`text-label-sm font-label-sm mt-0.5 ${done ? "text-on-surface-variant" : "text-outline"}`}>{step.sublabel}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Confirm button — only when status is "dikirim" and not yet confirmed */}
              {shipping === "dikirim" && !confirmed && (
                <div className="pt-4 border-t border-outline-variant space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-tertiary-container/20 border border-tertiary/20 rounded-xl">
                    <Icon name="info" fill className="text-tertiary shrink-0 mt-0.5" />
                    <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                      Paket sudah sampai? Konfirmasi penerimaan agar transaksi selesai.
                    </p>
                  </div>
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="w-full py-4 bg-primary text-on-primary rounded-xl font-button hover:brightness-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {confirming ? (
                      <>
                        <Icon name="sync" className="animate-spin" />
                        {t("historyDetail.confirming")}
                      </>
                    ) : (
                      <>
                        <Icon name="check_circle" fill />
                        {t("historyDetail.confirmDelivery")}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Done state */}
              {(shipping === "sampai" || confirmed) && (
                <div className="pt-4 border-t border-outline-variant flex items-center gap-3 p-4 bg-[#d1e7dd]/40 border border-[#0f5132]/20 rounded-xl">
                  <Icon name="check_circle" fill className="text-[#0f5132] shrink-0" style={{ fontSize: 28 }} />
                  <div>
                    <p className="font-body-md font-bold text-[#0f5132]">Transaksi Selesai</p>
                    <p className="text-label-sm text-on-surface-variant">Terima kasih telah mengkonfirmasi penerimaan.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-on-surface-variant">
                <Icon name="schedule" className="text-sm" />
                <p className="text-label-sm font-label-sm">
                  Estimasi pengiriman: <span className="font-bold text-on-surface">3–5 hari kerja</span>
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Deposit detail ── */}
        {!isRedeem && (
          <div className="bg-surface border border-outline-variant rounded-2xl p-4 md:p-6 space-y-3">
            <h2 className="font-body-md font-bold text-on-surface text-lg flex items-center gap-2">
              <Icon name="recycling" className="text-primary" />
              Detail Setoran
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="KATEGORI SAMPAH" value={tx.category} />
              <InfoCell
                label="BERAT"
                value={tx.weightGram != null ? `${tx.weightGram} g` : "—"}
              />
              <InfoCell
                label="POIN DIPEROLEH"
                value={tx.points ? `+${tx.points.toLocaleString("id-ID")} pts` : "Menunggu validasi"}
                accent={!!tx.points}
              />
              <InfoCell label="STATUS" value={
                (tx.status === "success" || tx.status === "completed") ? "Tervalidasi" :
                tx.status === "pending" ? "Menunggu Validasi" : 
                tx.status === "process" ? "Diproses" : "Ditolak"
              } />
            </div>
            {tx.status === "pending" && (
              <div className="flex items-start gap-3 p-4 bg-tertiary-container/20 border border-tertiary/20 rounded-xl">
                <Icon name="info" fill className="text-tertiary shrink-0 mt-0.5" />
                <p className="text-body-md text-on-surface-variant text-sm leading-relaxed">
                  Admin sedang memverifikasi setoran Anda. Proses validasi berlangsung dalam 1×24 jam di hari kerja.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}

function InfoCell({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-label-sm font-label-sm text-outline">{label}</p>
      <p className={`font-bold text-body-md break-words ${accent ? "text-primary" : "text-on-surface"} ${mono ? "font-label-sm text-label-sm" : ""}`}>
        {value}
      </p>
    </div>
  );
}
