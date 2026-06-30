"use client";

// Profit chart, best brands, stale inventory, recent sales — shown below the grid on home.
import { useMemo } from "react";
import Link from "next/link";
import { Item } from "@/lib/types";
import {
  bestSellingBrands,
  daysListed,
  formatCurrency,
  profit,
  profitChartLast6Months,
  soldItemsByProfit,
  staleInventoryOverDays,
} from "@/lib/compute";
import { getSaleLabel } from "@/lib/listing-utils";
import { panelCardClass } from "@/lib/ui-styles";

export default function AnalyticsSection({ items }: { items: Item[] }) {
  const monthly = useMemo(() => profitChartLast6Months(items), [items]);
  const brands = useMemo(() => bestSellingBrands(items), [items]);
  const stale = useMemo(() => staleInventoryOverDays(items, 60), [items]);
  const recentSales = useMemo(() => soldItemsByProfit(items).slice(0, 4), [items]);

  const hasSales = monthly.some((m) => m.profit > 0);
  const maxProfit = Math.max(1, ...monthly.map((m) => m.profit));
  const maxBrand = Math.max(1, ...brands.map((b) => b.profit));

  const chartW = 320;
  const chartH = 100;
  const points = monthly
    .map((m, i) => {
      const x =
        monthly.length === 1 ? chartW / 2 : (i / (monthly.length - 1)) * chartW;
      const y = chartH - (m.profit / maxProfit) * (chartH - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const chartSummary = hasSales
    ? monthly
        .filter((m) => m.profit > 0)
        .map((m) => `${m.label}: ${formatCurrency(m.profit)}`)
        .join(", ")
    : "No sales recorded yet";

  return (
    <section id="analytics" className="mt-20 border-t border-rackd-charcoal/8 pt-16">
      <h2 className="text-2xl font-bold tracking-tight text-rackd-charcoal">
        Analytics
      </h2>
      <p className="mt-1 text-sm text-rackd-charcoal/55">
        Profit trends, top brands, and inventory that needs attention.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article className={`p-5 ${panelCardClass}`}>
          <h3 className="font-semibold text-rackd-charcoal">Profit over time</h3>
          {!hasSales ? (
            <p className="mt-6 text-center text-sm text-rackd-charcoal/45">
              No sales yet — chart will fill in as you sell.
            </p>
          ) : (
            <div className="mt-4">
              <p className="sr-only">{chartSummary}</p>
              <svg
                viewBox={`0 0 ${chartW} ${chartH + 22}`}
                className="h-32 w-full"
                aria-hidden
              >
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1={0}
                    y1={chartH * pct}
                    x2={chartW}
                    y2={chartH * pct}
                    stroke="#36454F"
                    strokeOpacity={0.06}
                  />
                ))}
                <polyline
                  fill="none"
                  stroke="#36454F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {monthly.map((m, i) => {
                  const x =
                    monthly.length === 1
                      ? chartW / 2
                      : (i / (monthly.length - 1)) * chartW;
                  const y = chartH - (m.profit / maxProfit) * (chartH - 12) - 6;
                  return m.profit > 0 ? (
                    <circle key={m.label} cx={x} cy={y} r="3.5" fill="#B2E0D6" />
                  ) : null;
                })}
                {monthly.map((m, i) => {
                  const x =
                    monthly.length === 1
                      ? chartW / 2
                      : (i / (monthly.length - 1)) * chartW;
                  return (
                    <text
                      key={`${m.label}-${i}`}
                      x={x}
                      y={chartH + 16}
                      textAnchor="middle"
                      className="fill-rackd-charcoal/45 text-[9px]"
                    >
                      {m.label}
                    </text>
                  );
                })}
              </svg>
            </div>
          )}
        </article>

        <article className={`p-5 ${panelCardClass}`}>
          <h3 className="font-semibold text-rackd-charcoal">Best brands</h3>
          {brands.length === 0 ? (
            <p className="mt-6 text-center text-sm text-rackd-charcoal/45">
              No sales yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {brands.slice(0, 5).map((b) => (
                <li key={b.brand}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-rackd-charcoal">
                      {b.brand}
                    </span>
                    <span className="text-rackd-charcoal/55">
                      {formatCurrency(b.profit)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-pill bg-rackd-charcoal/8">
                    <div
                      className="h-full rounded-pill bg-rackd-mint"
                      style={{ width: `${(b.profit / maxBrand) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={`p-5 md:col-span-2 xl:col-span-1 ${panelCardClass}`}>
          <h3 className="font-semibold text-rackd-charcoal">Recent sales</h3>
          {recentSales.length === 0 ? (
            <p className="mt-6 text-center text-sm text-rackd-charcoal/45">
              Your best flips will show up here.
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {recentSales.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/items/${item.id}`}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-rackd-surface"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-rackd-charcoal">
                        {item.title}
                      </p>
                      <p className="text-xs text-rackd-charcoal/50">
                        {item.sale ? getSaleLabel(item.sale) : "Sold"}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-rackd-charcoal">
                      +{formatCurrency(profit(item))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={`p-5 md:col-span-2 xl:col-span-3 ${panelCardClass}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold text-rackd-charcoal">
              Stale inventory
            </h3>
            <p className="text-xs text-rackd-charcoal/45">
              Active items listed 60+ days
            </p>
          </div>
          {stale.length === 0 ? (
            <p className="mt-6 text-center text-sm text-rackd-charcoal/45">
              Nothing stale — great momentum.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-rackd-charcoal/8">
              {stale.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/items/${item.id}`}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-rackd-surface/80 sm:gap-5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-rackd-charcoal">
                        {item.title}
                      </p>
                      <p className="text-xs text-rackd-charcoal/50">
                        {item.brand} · Size {item.size}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-rackd-charcoal/60">
                      {daysListed(item)} days
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-rackd-charcoal">
                      {formatCurrency(item.askingPrice)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
