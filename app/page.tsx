"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { computeStats, formatCurrency } from "@/lib/compute";
import {
  Item,
  ItemStatus,
  Platform,
  PLATFORMS,
  PLATFORM_LABELS,
} from "@/lib/types";
import StatCard from "@/components/StatCard";
import ItemCard from "@/components/ItemCard";
import AddItemModal from "@/components/AddItemModal";
import MarkSoldModal from "@/components/MarkSoldModal";
import {
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle2,
  Search,
  Plus,
  PackageOpen,
} from "lucide-react";

export default function DashboardPage() {
  const { items } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [soldItem, setSoldItem] = useState<Item | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");

  const stats = useMemo(() => computeStats(items), [items]);

  const brands = useMemo(
    () => [...new Set(items.map((i) => i.brand))].sort(),
    [items]
  );
  const [brandFilter, setBrandFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (brandFilter !== "all" && item.brand !== brandFilter) return false;
      if (
        platformFilter !== "all" &&
        !item.listings.some((l) => l.platform === platformFilter)
      )
        return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !item.title.toLowerCase().includes(q) &&
          !item.brand.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, statusFilter, brandFilter, platformFilter, query]);

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500";

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Your reseller inventory across every platform.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus size={18} />
          Add Item
        </button>
      </header>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Inventory Value"
          value={formatCurrency(stats.inventoryValue)}
          icon={DollarSign}
          accent
        />
        <StatCard
          label="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          icon={TrendingUp}
        />
        <StatCard
          label="Active Items"
          value={String(stats.activeCount)}
          icon={Package}
        />
        <StatCard
          label="Items Sold"
          value={String(stats.soldCount)}
          icon={CheckCircle2}
        />
      </section>

      <section className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or brand…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className={selectClass}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ItemStatus | "all")
            }
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
          </select>
          <select
            className={selectClass}
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={platformFilter}
            onChange={(e) =>
              setPlatformFilter(e.target.value as Platform | "all")
            }
          >
            <option value="all">All platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <PackageOpen size={40} className="text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">No items found</p>
          <p className="text-sm text-slate-400">
            Try adjusting your filters, or add your first item.
          </p>
        </div>
      ) : (
        <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onMarkSold={setSoldItem} />
          ))}
        </section>
      )}

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <MarkSoldModal item={soldItem} onClose={() => setSoldItem(null)} />
    </div>
  );
}
