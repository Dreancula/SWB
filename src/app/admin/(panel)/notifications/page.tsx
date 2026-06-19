"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { getNotifications } from "@/lib/api";
import { useEcho } from "@/context/EchoContext";
import type { AppNotification } from "@/lib/types";

const ICON_COLOR: Record<string, string> = {
  recycling: "bg-primary-container/20 text-primary",
  redeem: "bg-secondary-container/20 text-secondary",
  notifications: "bg-tertiary-container/20 text-tertiary",
};

export default function AdminNotificationsPage() {
  const { notifications: realtimeNotifs, markAllRead } = useEcho();
  const [historical, setHistorical] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(setHistorical)
      .finally(() => setLoading(false));
    markAllRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Merge real-time + historical, dedup by id, exclude chat notifications
  const seenIds = new Set<string>();
  const items: AppNotification[] = [];
  for (const n of [...realtimeNotifs, ...historical]) {
    if (n.iconKey === "chat") continue;
    if (!seenIds.has(n.id)) {
      seenIds.add(n.id);
      items.push(n);
    }
  }

  const groups: AppNotification["group"][] = ["Terbaru", "Kemarin"];

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Notifikasi</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Setoran masuk, reward, dan aktivitas sistem
          </p>
        </div>
        {items.some((n) => !n.read) && (
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
            {items.filter((n) => !n.read).length} belum dibaca
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <Icon name="sync" className="animate-spin text-primary mr-3" style={{ fontSize: 24 }} />
          Memuat notifikasi…
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <Icon name="notifications_off" style={{ fontSize: 48 }} className="opacity-30 mb-3" />
          <p>Belum ada notifikasi.</p>
        </div>
      ) : (
        groups.map((group) => {
          const groupItems = items.filter((n) => n.group === group);
          if (!groupItems.length) return null;
          return (
            <section key={group} className="mb-8">
              <h2 className="text-xs font-bold text-outline uppercase tracking-wider mb-3 px-1">
                {group}
              </h2>
              <div className="space-y-2">
                {groupItems.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      n.read
                        ? "bg-surface border-outline-variant"
                        : "bg-primary-container/5 border-primary/20"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        ICON_COLOR[n.iconKey] ?? ICON_COLOR.notifications
                      }`}
                    >
                      <Icon name={n.iconKey} fill />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-on-surface text-sm leading-snug">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5 leading-relaxed">
                        {n.body}
                      </p>
                      <p className="text-xs text-outline mt-1">{n.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
