"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    address: "",
  });
  const [accept, setAccept] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setLocalError(null);
    if (!form.fullName || !form.email || !form.password) {
      setLocalError("Nama, email, dan password wajib diisi.");
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!accept) {
      setLocalError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }
    const ok = await register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      address: form.address,
    });
    if (ok) router.push("/dashboard");
  }

  const inputClass =
    "block w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-surface-container-low">
        <nav className="max-w-7xl mx-auto h-20 px-container-padding-mobile md:px-container-padding-desktop flex justify-between items-center">
          <div className="text-headline-md font-headline-md font-bold text-primary">
            Smart Eco Bank
          </div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link
              href="/about"
              className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/"
              className="px-6 py-2 bg-primary text-on-primary rounded-full font-button text-button hover:opacity-90 transition-opacity"
            >
              Masuk
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex items-stretch">
        <div className="w-full flex flex-col md:flex-row">
          {/* Left brand */}
          <section className="hidden md:flex md:w-1/2 relative overflow-hidden eco-gradient items-center justify-center p-container-padding-desktop">
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 bg-primary-container/20 px-4 py-2 rounded-full border border-primary-container/30 mb-stack-md backdrop-blur-sm">
                <Icon name="eco" fill className="text-primary-fixed" />
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest">
                  Sustainability First
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-white mb-stack-md">
                Ubah Sampah Jadi Poin &amp; Aset Digital
              </h1>
              <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg leading-relaxed">
                Bergabunglah dengan ekosistem perbankan pertama yang menghargai
                setiap aksi lingkungan Anda.
              </p>
              <div className="grid grid-cols-2 gap-stack-md">
                <div className="glass-panel p-stack-md rounded-2xl flex flex-col items-center text-center">
                  <Icon
                    name="recycling"
                    className="text-primary text-4xl mb-2"
                  />
                  <span className="font-label-sm text-label-sm text-primary uppercase">
                    Waste-to-Wealth
                  </span>
                </div>
                <div className="glass-panel p-stack-md rounded-2xl flex flex-col items-center text-center">
                  <Icon
                    name="account_balance_wallet"
                    className="text-primary text-4xl mb-2"
                  />
                  <span className="font-label-sm text-label-sm text-primary uppercase">
                    Safe Digital Asset
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl" />
          </section>

          {/* Right form */}
          <section className="w-full md:w-1/2 bg-surface flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop">
            <div className="w-full max-w-md py-8">
              <div className="mb-stack-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                  Buat Akun Baru
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Lengkapi data diri Anda untuk memulai perjalanan ekologis.
                </p>
              </div>

              <div className="space-y-stack-md">
                <Field label="Nama Lengkap">
                  <input
                    className={inputClass}
                    placeholder="Budi Santoso"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
                <Field label="Nomor HP">
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="0812xxxxxxx"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <Field label="Password">
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                    />
                  </Field>
                  <Field label="Konfirmasi Password">
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={(e) => update("confirm", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Alamat Lengkap">
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Jl. Hijau Lestari No. 123..."
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </Field>

                <div className="flex items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={accept}
                    onChange={(e) => setAccept(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary bg-surface-container border-outline-variant rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="terms"
                    className="font-body-md text-label-sm text-on-surface-variant"
                  >
                    Saya menyetujui{" "}
                    <Link href="#" className="text-primary font-bold">
                      Syarat &amp; Ketentuan
                    </Link>{" "}
                    serta kebijakan privasi Smart Eco Bank.
                  </label>
                </div>

                {(localError || error) && (
                  <p className="text-error text-label-sm font-label-sm">
                    {localError ?? error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-on-primary rounded-xl font-button text-button shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-70"
                >
                  {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                </button>

                <p className="text-center mt-stack-lg font-body-md text-on-surface-variant">
                  Sudah punya akun?{" "}
                  <Link href="/" className="text-primary font-bold">
                    Masuk
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
