"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import {
  bestSellingBrands,
  daysListed,
  formatCurrency,
  profit,
  soldItemsByProfit,
  staleInventory,
} from "@/lib/compute";
import { TrendingUp, Award, Clock } from "lucide-react";

export default function AnalyticsPage() {
  const { items } = useStore();

  const byProfit = useMemo(() => soldItemsByProfit(items), [items]);
  const brands = useMemo(() => bestSellingBrands(items), [items]);
  const stale = useMemo(() => staleInventory(items), [items]);

  const maxBrandProfit = Math.max(1, ...brands.map((b) => b.profit));

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">
          Understand what&apos;s selling, what&apos;s profitable, and what&apos;s
          sitting.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Profit per item" icon={TrendingUp}>
          {byProfit.length === 0 ? (
            <Empty text="No sales yet — mark an item sold to see profit." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {byProfit.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.brand} · sold on {item.sale?.platformSold}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold ${
                      profit(item) >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {formatCurrency(profit(item))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Best-selling brands" icon={Award}>
          {brands.length === 0 ? (
            <Empty text="No sales yet." />
          ) : (
            <ul className="space-y-3">
              {brands.map((b) => (
                <li key={b.brand}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {b.brand}
                    </span>
                    <span className="text-slate-500">
                      {formatCurrency(b.profit)} · {b.soldCount} sold
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{
                        width: `${(b.profit / maxBrandProfit) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Stale inventory"
          icon={Clock}
          subtitle="Active items listed the longest"
          className="lg:col-span-2"
        >
          {stale.length === 0 ? (
            <Empty text="Nothing stale — everything's moving!" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {stale.slice(0, 6).map((item) => {
                const days = daysListed(item);
                const isStale = days > 30;
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.brand} · {formatCurrency(item.askingPrice)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        isStale
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {days} days listed
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon: typeof TrendingUp;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-card ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon size={16} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-slate-400">{text}</p>;
}
