"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

const SETTINGS = [
  {
    icon: "security",
    title: "Keamanan",
    desc: "Otentikasi dua faktor & ubah PIN transaksi.",
    cta: "Kelola",
  },
  {
    icon: "notifications",
    title: "Notifikasi",
    desc: "Atur peringatan saldo dan laporan hijau mingguan.",
    cta: "Kelola",
  },
  {
    icon: "language",
    title: "Bahasa",
    desc: "Indonesia",
    cta: "Ubah",
  },
  {
    icon: "help",
    title: "Bantuan",
    desc: "Pusat bantuan 24/7 dan pertanyaan umum.",
    cta: "Buka Chat",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const name = user?.fullName ?? "Budi Santoso";
  const level = user?.greenLevel ?? "Level 4: Green Hero";
  const co2 = user?.co2SavedKg ?? 12;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg space-y-stack-lg">
        <section>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-base">
            Pengaturan Akun
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Kelola profil Anda dan pantau dampak ekologis bersama Smart Eco Bank.
          </p>
        </section>

        {/* Profile */}
        <div className="glass-card rounded-xl p-stack-md flex items-center gap-stack-md">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <Icon name="person" fill style={{ fontSize: 32 }} />
          </div>
          <div className="flex-grow">
            <p className="font-body-md font-bold text-on-surface text-lg">
              {name}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {user?.email ?? "budi@email.com"} · Active Saver
            </p>
          </div>
          <button className="py-2 px-4 bg-primary-container text-on-primary-container font-button text-button rounded-lg hover:brightness-95 transition-all">
            Ubah Profil
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Settings grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-stack-md content-start">
            {SETTINGS.map((s) => (
              <div
                key={s.title}
                className="glass-card p-stack-md rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-stack-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={s.icon} />
                </div>
                <h3 className="font-headline-md text-body-md font-bold mb-base">
                  {s.title}
                </h3>
                <p className="font-label-sm text-on-surface-variant mb-stack-md">
                  {s.desc}
                </p>
                <span className="text-primary font-button text-sm flex items-center gap-1">
                  {s.cta} <Icon name="chevron_right" className="text-sm" />
                </span>
              </div>
            ))}

            <div className="sm:col-span-2">
              <button
                onClick={() => setConfirmLogout(true)}
                className="flex items-center gap-stack-md p-stack-md w-full rounded-xl text-error border border-error/20 hover:bg-error-container/20 transition-all"
              >
                <Icon name="logout" />
                <span className="font-body-md font-bold">Logout</span>
              </button>
            </div>
          </div>

          {/* Green impact */}
          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-20 rotate-12">
              <Icon name="eco" fill style={{ fontSize: 160 }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-stack-lg">
                <Icon name="eco" fill />
                <h2 className="font-headline-md text-headline-md">
                  Dampak Hijau
                </h2>
              </div>
              <div className="mb-stack-lg">
                <p className="text-primary-fixed text-label-sm font-label-sm uppercase tracking-wider">
                  CO2 Terhemat Bulan Ini
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold">{co2}</span>
                  <span className="text-xl font-bold">kg</span>
                </div>
              </div>
              <div className="glass-panel rounded-xl p-4 flex items-center gap-stack-md border border-white/30">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary">
                  <Icon name="workspace_premium" fill />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase opacity-80">
                    Badge Anda
                  </p>
                  <p className="font-body-md font-extrabold leading-tight">
                    {level}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm italic opacity-90">
                  &ldquo;Langkah kecil Anda hari ini menyelamatkan masa depan
                  bumi.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmLogout && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="bg-surface rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center text-error mx-auto">
              <Icon name="logout" style={{ fontSize: 32 }} />
            </div>
            <h3 className="text-headline-md font-headline-md mt-4">
              Keluar dari akun?
            </h3>
            <p className="text-body-md text-on-surface-variant mt-2">
              Anda perlu masuk kembali untuk mengakses dashboard.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-3 border border-outline rounded-xl font-button hover:bg-surface-variant transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-error text-on-error rounded-xl font-button hover:brightness-95 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
