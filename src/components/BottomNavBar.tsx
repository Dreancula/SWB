"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/locations", label: "Locations", icon: "location_on" },
  { href: "/history", label: "History", icon: "receipt_long" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function BottomNavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 scale-95 transition-transform duration-200"
                : "flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container transition-colors"
            }
          >
            <Icon name={item.icon} fill={active} />
            <span className="text-label-sm font-label-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
