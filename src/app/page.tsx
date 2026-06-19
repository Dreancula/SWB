"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

export default function LandingLoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    const user = await login(email, password);
    if (user) router.push(user.role === "admin" ? "/admin/verification" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 w-full bg-surface border-b border-surface-variant">
        <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2">
            <Icon name="eco" fill className="text-primary text-3xl" />
            <span className="text-headline-md font-headline-md font-bold text-primary">
              Smart Eco Bank
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hidden md:block text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <button
              onClick={handleSubmit}
              className="hidden md:block px-6 py-2 rounded-full border border-primary text-primary font-button hover:bg-primary-container/10 transition-all"
            >
              Masuk
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row max-w-[1280px] mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop py-stack-lg gap-gutter items-center">
        {/* Left banner */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-stack-lg relative">
          <div className="space-y-stack-md relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/10 border border-primary/20 rounded-full">
              <Icon
                name="auto_awesome"
                fill
                className="text-primary text-sm"
              />
              <span className="text-label-sm font-label-sm text-on-primary-container">
                REVOLUSI FINTECH HIJAU
              </span>
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg leading-tight">
              Ubah Sampah Jadi <span className="text-primary italic">Poin</span>{" "}
              &amp; <span className="text-primary">Aset Digital</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg">
              Gabungkan kepedulian lingkungan dengan kecerdasan finansial. Setor
              sampah terpilah Anda, dapatkan imbalan instan, dan pantau
              pertumbuhan ekonomi hijau Anda dalam satu platform AI terpadu.
            </p>
          </div>
          <div className="flex items-center gap-stack-md pt-stack-md">
            <div className="flex -space-x-3">
              {["#2ecc71", "#485c97", "#735c00"].map((c, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-surface flex items-center justify-center text-white"
                  style={{ backgroundColor: c }}
                >
                  <Icon name="person" fill className="text-lg" />
                </span>
              ))}
            </div>
            <div className="text-body-md font-body-md text-on-surface-variant">
              <span className="font-bold text-on-surface">12k+</span> Pahlawan
              Lingkungan Bergabung
            </div>
          </div>
          <div className="hidden md:block floating-eco w-32 h-32 absolute right-0 top-0 opacity-20 pointer-events-none">
            <Icon
              name="recycling"
              fill
              className="text-primary"
              style={{ fontSize: 120 }}
            />
          </div>
        </div>

        {/* Right: login form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="glass-card w-full max-w-md p-stack-lg rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-stack-lg">
              <div className="space-y-1">
                <h2 className="text-headline-md font-headline-md">
                  Selamat Datang
                </h2>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Masuk untuk melanjutkan menabung.
                </p>
              </div>
              <div className="p-2 bg-secondary-container/20 rounded-lg">
                <Icon name="login" fill className="text-secondary" />
              </div>
            </div>

            <div className="space-y-stack-md">
              <div className="space-y-2">
                <label className="text-label-sm font-label-sm text-outline block">
                  EMAIL
                </label>
                <div className="relative">
                  <Icon
                    name="mail"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-label-sm font-label-sm text-outline block">
                  PASSWORD
                </label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-error text-label-sm font-label-sm">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 eco-gradient text-white font-button rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? "Memproses..." : "Masuk Sekarang"}
                <Icon
                  name="arrow_forward"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <p className="text-center text-body-md font-body-md text-on-surface-variant pt-4">
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary font-bold">
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-surface-variant text-center">
        <p className="text-label-sm font-label-sm text-outline">
          © 2026 Smart Eco Bank. Mengubah limbah menjadi masa depan yang
          berkelanjutan.
        </p>
      </footer>
    </div>
  );
}
