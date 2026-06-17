"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { getLocations } from "@/lib/api";
import type { DropLocation } from "@/lib/types";

export default function LocationsPage() {
  const [locations, setLocations] = useState<DropLocation[]>([]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    getLocations(query).then((locs) => {
      setLocations(locs);
      setActiveId((prev) => prev ?? locs[0]?.id ?? null);
    });
  }, [query]);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-160px)]">
        {/* Side list */}
        <aside className="w-full md:w-1/3 flex flex-col bg-surface-container-low border-r border-surface-variant">
          <div className="p-stack-md flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-md font-headline-md text-primary">
                Pilih Lokasi Kamu
              </h1>
              <p className="text-body-md text-on-surface-variant">
                Temukan titik pengumpulan sampah terdekat Anda.
              </p>
            </div>
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari area atau jalan..."
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-stack-lg custom-scrollbar space-y-4">
            {locations.map((loc) => {
              const active = loc.id === activeId;
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveId(loc.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-95 ${
                    active
                      ? "bg-surface-container-lowest border-2 border-primary shadow-md"
                      : "bg-surface border border-outline-variant"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    {loc.isOpen ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/10 text-primary text-label-sm font-label-sm">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-container text-error text-label-sm font-label-sm">
                        Tutup
                      </span>
                    )}
                    <span className="text-label-sm text-outline font-label-sm">
                      {loc.distanceKm} km
                    </span>
                  </div>
                  <h3 className="text-body-lg font-bold text-on-surface">
                    {loc.name}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-3">
                    {loc.address}
                  </p>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Icon
                      name={loc.isOpen ? "group" : "schedule"}
                      className="text-[18px]"
                    />
                    <span className="text-label-sm">
                      {loc.isOpen
                        ? `+${loc.visitorsToday} orang berkunjung hari ini`
                        : loc.openInfo}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Simulated map */}
        <section className="flex-1 relative bg-surface-variant overflow-hidden min-h-[400px]">
          <div
            className="absolute inset-0 bg-[#e0e3e1]"
            style={{
              backgroundImage:
                "radial-gradient(#006d37 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Pins */}
          {locations.map((loc) => {
            const active = loc.id === activeId;
            return (
              <button
                key={loc.id}
                onClick={() => setActiveId(loc.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ top: `${loc.mapY}%`, left: `${loc.mapX}%` }}
              >
                <span
                  className={`flex items-center justify-center rounded-full shadow-2xl border-4 border-white transition-transform group-hover:scale-110 ${
                    !loc.isOpen
                      ? "bg-error text-white w-10 h-10"
                      : active
                        ? "bg-primary text-white w-12 h-12"
                        : "bg-primary-container text-on-primary-container w-10 h-10"
                  }`}
                >
                  <Icon
                    name={loc.isOpen ? "location_on" : "location_off"}
                    fill
                    className={active ? "text-[28px]" : "text-[18px]"}
                  />
                </span>
                {active && loc.isOpen && (
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-white/95 backdrop-blur px-3 py-1 rounded-lg shadow-xl border border-primary/10">
                    <span className="text-label-sm font-bold text-primary block">
                      {loc.name}
                    </span>
                  </span>
                )}
              </button>
            );
          })}

          {/* Info card */}
          <div className="hidden md:block absolute top-10 left-10 p-6 glass-card rounded-2xl shadow-2xl max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="analytics" className="text-primary" />
              </div>
              <h2 className="text-body-lg font-extrabold text-on-surface">
                Area Jangkauan
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
                  Total Posko
                </span>
                <span className="text-headline-md font-bold text-primary">
                  {locations.length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-outline font-bold">
                  Tersedia
                </span>
                <span className="text-headline-md font-bold text-primary">
                  {locations.filter((l) => l.isOpen).length}
                </span>
              </div>
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            {["add", "remove"].map((c) => (
              <button
                key={c}
                className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Icon name={c} />
              </button>
            ))}
            <button className="w-12 h-12 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center mt-2">
              <Icon name="my_location" />
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
