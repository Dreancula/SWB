"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";

const LEFT_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/locations", label: "Locations", icon: "location_on" },
];

const RIGHT_ITEMS = [
  { href: "/history", label: "History", icon: "receipt_long" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
          active
            ? "text-primary"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        <span
          className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
            active ? "bg-primary-container" : ""
          }`}
        >
          <Icon name={icon} fill={active} className="text-[22px]" />
        </span>
        <span className="text-[10px] font-medium mt-0.5 leading-tight">{label}</span>
      </Link>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex items-center px-1 py-1 md:hidden bg-surface shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] border-t border-surface-variant">
      {LEFT_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}

      {/* Setor — center FAB */}
      <Link
        href="/scanner"
        className="flex-1 -mt-5 flex flex-col items-center justify-center"
      >
        <span
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
            pathname === "/scanner"
              ? "bg-primary-fixed text-on-surface"
              : "bg-primary text-on-primary"
          }`}
        >
          <Icon name="recycling" fill={pathname === "/scanner"} />
        </span>
        <span className="text-[10px] font-medium text-primary mt-0.5">Scan</span>
      </Link>

      {RIGHT_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
