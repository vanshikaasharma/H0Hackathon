"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Shirt } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Shirt size={20} />
        </div>
        <div>
          <p className="text-lg font-bold leading-none text-slate-900">FlipHQ</p>
          <p className="text-xs text-slate-400">Reseller HQ</p>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto m-3 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
        <p className="text-sm font-semibold">One source of truth</p>
        <p className="mt-1 text-xs text-brand-100">
          Track every item across Depop, Poshmark, Vinted & eBay.
        </p>
      </div>
    </aside>
  );
}
