"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { getAdminProfile, ACTIVITY_LOGS } from "@/lib/adminApi";
import type { AdminProfile } from "@/lib/adminTypes";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getAdminProfile().then((p: AdminProfile) => {
      setName(p.name);
      setEmail(p.email);
      setRole(p.role);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setToast("Profil berhasil disimpan");
    setTimeout(() => setToast(null), 3000);
  }

  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  } as const;

  return (
    <>
      {/* TopNavBar */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-10 py-4 bg-surface border-b border-surface-variant">
        <h1 className="text-headline-md font-headline-md font-bold text-primary">Smart Eco Bank</h1>
        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm"
        >
          <Icon name="logout" style={{ fontSize: 18 }} />
          <span className="hidden md:inline">Keluar</span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 md:px-10 py-6 md:py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">
              Profil Admin
            </h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Kelola informasi profil dan pengaturan keamanan akun administrator Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Profile + Security */}
            <div className="lg:col-span-8 space-y-6">
              {/* Profile card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant shadow-sm">
                {/* Avatar */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                  <div className="relative group shrink-0">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-surface-container-high border-2 border-primary-container flex items-center justify-center overflow-hidden">
                      <Icon name="person" fill className="text-outline" style={{ fontSize: 64 }} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-2xl">
                        <Icon name="photo_camera" className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-7 w-40 bg-surface-container rounded animate-pulse" />
                        <div className="h-4 w-28 bg-surface-container rounded animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-headline-md font-headline-md text-on-surface">{name}</h3>
                        <p className="text-primary text-label-sm font-label-sm uppercase tracking-widest mt-1">
                          {role}
                        </p>
                      </>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-button text-sm hover:brightness-95 transition-all">
                        Unggah Foto Baru
                      </button>
                      <button className="border border-outline text-on-surface-variant px-4 py-2 rounded-lg font-button text-sm hover:bg-surface-variant transition-all">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-4 pt-6 border-t border-outline-variant">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Nama Lengkap"
                      value={name}
                      onChange={setName}
                      type="text"
                    />
                    <FormField
                      label="Alamat Email"
                      value={email}
                      onChange={setEmail}
                      type="email"
                    />
                    <div className="md:col-span-2">
                      <FormField
                        label="Jabatan"
                        value={role}
                        onChange={setRole}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-button hover:brightness-95 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Icon name="sync" className="animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Icon name="save" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security */}
              <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="security" className="text-primary" />
                  <h3 className="text-headline-md font-headline-md text-on-surface">Keamanan</h3>
                </div>
                <div className="space-y-4">
                  {/* Password */}
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 gap-4 flex-wrap">
                    <div>
                      <h4 className="font-bold text-on-surface">Kata Sandi</h4>
                      <p className="text-on-surface-variant text-sm">Terakhir diubah 3 bulan yang lalu</p>
                    </div>
                    <button className="border border-primary text-primary px-4 py-2 rounded-lg font-button text-sm hover:bg-primary/5 transition-all shrink-0">
                      Ubah Password
                    </button>
                  </div>
                  {/* 2FA */}
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="phonelink_lock" className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Otentikasi Dua Faktor (2FA)</h4>
                        <p className="text-on-surface-variant text-sm">
                          Amankan akun dengan lapisan verifikasi tambahan.
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-primary font-bold text-xs uppercase">Aktif</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-button text-sm hover:brightness-95 transition-all shrink-0">
                      Pengaturan 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Eco score + Activity + Sessions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Eco impact score */}
              <div className="eco-gradient text-white rounded-xl p-6 overflow-hidden relative">
                <div className="absolute -right-8 -top-8 opacity-20 rotate-12 pointer-events-none">
                  <Icon name="eco" style={{ fontSize: 140 }} />
                </div>
                <h4 className="text-label-sm font-label-sm uppercase tracking-wider mb-4 opacity-90">
                  Eco-Impact Admin Score
                </h4>
                <div className="text-4xl font-bold mb-2">98.4%</div>
                <p className="text-sm opacity-80">
                  Efisiensi operasional tanpa kertas dalam 30 hari terakhir.
                </p>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-xs mb-2">
                    <span>Pencapaian Mingguan</span>
                    <span>Target: 95%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: "98.4%" }} />
                  </div>
                </div>
              </div>

              {/* Activity log */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
                <h3 className="font-bold text-on-surface mb-4">Log Aktivitas Terakhir</h3>
                <div className="space-y-4">
                  {ACTIVITY_LOGS.map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className={`w-2 rounded-full shrink-0 ${colorMap[log.color]}`} />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{log.action}</p>
                        <p className="text-xs text-on-surface-variant">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-primary font-bold text-sm hover:underline text-left">
                  Lihat Semua Aktivitas
                </button>
              </div>

              {/* Sessions */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
                <h3 className="font-bold text-on-surface mb-4">Sesi Aktif</h3>
                <div className="flex items-center gap-3">
                  <Icon name="laptop_mac" className="text-on-surface-variant" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">MacBook Pro - Jakarta</p>
                    <p className="text-xs text-primary">Sesi Sekarang</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 opacity-60">
                  <Icon name="smartphone" className="text-on-surface-variant" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">Android Phone</p>
                    <p className="text-xs text-on-surface-variant">Aktif 2 jam yang lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <div className="bg-on-background text-surface rounded-xl px-6 py-4 shadow-xl flex items-center gap-4">
            <Icon name="check_circle" fill className="text-primary-fixed" />
            <p className="text-body-md">{toast}</p>
          </div>
        </div>
      )}
    </>
  );
}

function FormField({
  label,
  value,
  onChange,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: "text" | "email";
}) {
  return (
    <div className="space-y-2">
      <label className="text-label-sm font-label-sm text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
      />
    </div>
  );
}
