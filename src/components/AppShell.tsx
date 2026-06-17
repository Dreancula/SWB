import { ReactNode } from "react";
import TopNavBar from "./TopNavBar";
import BottomNavBar from "./BottomNavBar";
import Footer from "./Footer";

/** Kerangka halaman terautentikasi: TopNav + konten + Footer + BottomNav mobile. */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <TopNavBar />
      <main className="flex-grow w-full pb-24 md:pb-0">{children}</main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
