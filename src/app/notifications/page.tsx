"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { getNotifications } from "@/lib/api";
import type { AppNotification } from "@/lib/types";

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  const groups: AppNotification["group"][] = ["Terbaru", "Kemarin"];

  return (
    <AppShell>
      <div className="max-w-[800px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary mb-stack-lg">
          Notifikasi
        </h1>

        {groups.map((group) => {
          const groupItems = items.filter((n) => n.group === group);
          if (groupItems.length === 0) return null;
          return (
            <section key={group} className="mb-stack-lg">
              <h2 className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-stack-md">
                {group}
              </h2>
              <div className="space-y-stack-sm">
                {groupItems.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 p-stack-md rounded-xl border transition-colors ${
                      n.read
                        ? "bg-surface border-outline-variant"
                        : "bg-primary-container/5 border-primary/20"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                      <Icon name={n.iconKey} fill />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-body-md font-bold text-on-surface">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </div>
                      <p className="text-body-md text-on-surface-variant">
                        {n.body}
                      </p>
                      <p className="text-label-sm font-label-sm text-outline mt-1">
                        {n.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            Memuat notifikasi…
          </div>
        )}
      </div>
    </AppShell>
  );
}
