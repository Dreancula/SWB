"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Icon from "@/components/ui/Icon";
import { analyzeWaste, estimatePoints, submitDeposit } from "@/lib/api";
import type { ScanResult } from "@/lib/types";

type Phase = "upload" | "analyzing" | "result" | "submitting" | "done";

export default function ScannerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [productName, setProductName] = useState("");
  const [grams, setGrams] = useState("");

  async function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setPhase("analyzing");
    const r = await analyzeWaste(file);
    setResult(r);
    setProductName(r.productName);
    setPhase("result");
  }

  function reset() {
    setPhase("upload");
    setPreview(null);
    setResult(null);
    setProductName("");
    setGrams("");
  }

  async function handleSubmit() {
    if (!result) return;
    setPhase("submitting");
    await submitDeposit({
      productName,
      category: result.category,
      weightGrams: parseFloat(grams) || 0,
    });
    setPhase("done");
  }

  const points = estimatePoints(parseFloat(grams) || 0);

  return (
    <AppShell>
      <div className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-background mb-2">
            Setor Sampah AI
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Gunakan teknologi AI untuk mendeteksi jenis sampah otomatis.
            Pastikan foto jelas dan pencahayaan cukup untuk hasil terbaik.
          </p>
        </div>

        {phase === "upload" && (
          <label
            className="flex flex-col items-center justify-center min-h-[400px] rounded-xl p-stack-lg cursor-pointer transition-all hover:bg-primary-container/5"
            style={{
              border: "2px dashed #6c7b6d",
              backgroundImage:
                "radial-gradient(#bbcbbb 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
            <div className="text-center">
              <Icon
                name="cloud_upload"
                className="text-primary mb-4"
                style={{ fontSize: 64 }}
              />
              <h2 className="text-headline-md font-headline-md mb-2">
                Klik untuk Upload Foto
              </h2>
              <p className="text-body-md text-on-surface-variant">
                atau tarik gambar ke sini (JPG, PNG, max 10MB)
              </p>
            </div>
          </label>
        )}

        {(phase === "analyzing" ||
          phase === "result" ||
          phase === "submitting") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {/* Image preview */}
            <div className="flex flex-col gap-4">
              <div
                className="rounded-lg overflow-hidden aspect-square bg-surface-container-low flex items-center justify-center relative"
                style={{
                  border: "2px solid #006d37",
                  padding: 8,
                  background: "rgba(0,109,55,0.03)",
                }}
              >
                {phase === "analyzing" && <div className="scan-line" />}
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Preview sampah"
                    className={`w-full h-full object-cover transition-opacity duration-700 ${
                      phase === "analyzing" ? "opacity-30" : "opacity-100"
                    }`}
                  />
                ) : (
                  <Icon
                    name="image"
                    className="text-outline"
                    style={{ fontSize: 64 }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                <Icon
                  name={phase === "analyzing" ? "sync" : "check_circle"}
                  fill
                />
                {phase === "analyzing"
                  ? "AI SEDANG MENGANALISIS..."
                  : "AI ANALISIS SELESAI"}
              </div>
            </div>

            {/* Result form */}
            <div className="flex flex-col justify-between p-4 bg-white rounded-xl shadow-sm border border-surface-variant">
              {result && (
                <div className="space-y-stack-md">
                  <FieldRow label="NAMA PENYETOR">
                    <input
                      readOnly
                      value={result.depositorName}
                      className="w-full p-3 rounded-lg border border-surface-variant bg-surface-container-low outline-none"
                    />
                  </FieldRow>
                  <FieldRow label="NAMA PRODUK / SAMPAH">
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full p-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </FieldRow>
                  <FieldRow label="KATEGORI TERDETEKSI">
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-full text-label-sm font-label-sm border ${
                            i === 0
                              ? "bg-primary-container text-on-primary-container border-primary/20"
                              : i === 1
                                ? "bg-secondary-container text-on-secondary-container border-secondary/20"
                                : "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </FieldRow>
                  <FieldRow label="BERAT SAMPAH (GRAM)">
                    <input
                      type="number"
                      min={0}
                      value={grams}
                      onChange={(e) => setGrams(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 rounded-lg border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </FieldRow>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-stack-sm">
                      <label className="text-label-sm font-label-sm text-outline">
                        ESTIMASI POIN
                      </label>
                      <div className="p-3 bg-surface-container-low rounded-lg font-bold text-primary flex items-center gap-2">
                        <Icon name="eco" /> {points} Poin
                      </div>
                    </div>
                    <div className="space-y-stack-sm">
                      <label className="text-label-sm font-label-sm text-outline">
                        KEAKURATAN AI
                      </label>
                      <div className="p-3 bg-surface-container-low rounded-lg font-bold text-secondary flex items-center gap-2">
                        <Icon name="analytics" /> {result.confidence}%
                      </div>
                    </div>
                  </div>
                  <p className="text-label-sm font-label-sm text-outline">
                    1.000 gram = 2 poin
                  </p>
                </div>
              )}

              <div className="mt-stack-lg flex justify-end gap-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-outline text-on-surface font-button text-button rounded-xl hover:bg-surface-variant transition-colors"
                >
                  Ulangi Foto
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={phase === "submitting" || !grams}
                  className="px-6 py-3 bg-primary text-on-primary font-button text-button rounded-xl hover:brightness-95 shadow-lg flex items-center gap-2 group transition-all active:scale-95 disabled:opacity-60"
                >
                  {phase === "submitting" ? "Mengirim..." : "Kirim Setor"}
                  <Icon
                    name="send"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <Icon name="check_circle" fill style={{ fontSize: 48 }} />
            </div>
            <h2 className="text-headline-md font-headline-md text-primary">
              Setoran Terkirim!
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Setoran Anda sedang menunggu validasi admin. Poin akan masuk
              setelah diverifikasi dan muncul di riwayat transaksi.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={reset}
                className="px-6 py-3 border border-outline text-on-surface font-button rounded-xl hover:bg-surface-variant transition-colors"
              >
                Setor Lagi
              </button>
              <button
                onClick={() => router.push("/history")}
                className="px-6 py-3 bg-primary text-on-primary font-button rounded-xl hover:brightness-95 transition-all"
              >
                Lihat Riwayat
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-stack-sm">
      <label className="text-label-sm font-label-sm text-outline">
        {label}
      </label>
      {children}
    </div>
  );
}
