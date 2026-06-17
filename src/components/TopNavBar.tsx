"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/locations", label: "Locations" },
  { href: "/history", label: "Transactions" },
  { href: "/rewards", label: "Rewards" },
  { href: "/settings", label: "Settings" },
];

export default function TopNavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-surface-variant">
      <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-headline-md font-headline-md font-bold text-primary"
          >
            Smart Eco Bank
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "text-body-md font-body-md text-primary border-b-2 border-primary pb-1"
                      : "text-body-md font-body-md text-on-surface-variant hover:text-primary transition-colors"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/customer-service"
            className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
            aria-label="Customer Service"
          >
            <Icon name="headset_mic" />
          </Link>
          <Link
            href="/notifications"
            className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
            aria-label="Notifikasi"
          >
            <Icon name="notifications" />
          </Link>
          <Link
            href="/settings"
            className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-surface-variant text-on-primary-container"
            aria-label="Profil"
          >
            <Icon name="person" fill />
          </Link>
        </div>
      </div>
    </header>
  );
}
