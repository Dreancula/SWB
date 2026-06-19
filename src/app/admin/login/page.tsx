"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await adminLogin(email, password);
    if (ok) {
      router.push("/admin/verification");
    } else {
      setError("Email atau password salah.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="eco-gradient rounded-t-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Icon name="admin_panel_settings" fill className="text-white" style={{ fontSize: 36 }} />
          </div>
          <h1 className="text-headline-md font-headline-md text-white font-bold">Smart Eco Bank</h1>
          <p className="text-white/80 text-label-sm font-label-sm uppercase tracking-widest mt-1">
            Admin Portal
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-b-2xl p-8 space-y-6 border border-outline-variant border-t-0 shadow-lg"
        >
          <div className="space-y-2">
            <label className="text-label-sm font-label-sm text-outline">EMAIL ADMIN</label>
            <div className="relative">
              <Icon name="email" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smarteco.bank"
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-label-sm text-outline">PASSWORD</label>
            <div className="relative">
              <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              >
                <Icon name={showPass ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-container rounded-xl text-error text-body-md">
              <Icon name="error" fill className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-on-primary font-button rounded-xl hover:brightness-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Icon name="sync" className="animate-spin" />
                Masuk...
              </>
            ) : (
              <>
                <Icon name="login" />
                Masuk ke Admin Panel
              </>
            )}
          </button>

          <p className="text-center text-label-sm font-label-sm text-outline">
            Akses terbatas untuk admin resmi Smart Eco Bank
          </p>
        </form>

        {/* Demo hint */}
        <p className="text-center text-[11px] text-outline mt-4">
          Demo: admin@smarteco.bank / admin123
        </p>
      </div>
    </div>
  );
}
