"use client";

// Home page — stats, filters, item grid, analytics section at the bottom.
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { useSearch } from "@/lib/search-context";
import { computeStats, formatCurrency } from "@/lib/compute";
import {
  Item,
  ItemStatus,
  KnownPlatform,
  PLATFORMS,
  PLATFORM_LABELS,
} from "@/lib/types";
import StatCard from "@/components/StatCard";
import ItemCard from "@/components/ItemCard";
import ItemFormModal from "@/components/ItemFormModal";
import MarkSoldModal from "@/components/MarkSoldModal";
import AnalyticsSection from "@/components/AnalyticsSection";
import {
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle2,
  Plus,
  PackageOpen,
  ChevronDown,
} from "lucide-react";

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className="appearance-none rounded-pill border border-rackd-charcoal/10 bg-white py-2 pl-4 pr-9 text-sm font-medium text-rackd-charcoal outline-none transition-colors hover:border-rackd-charcoal/20 focus:border-rackd-mint-dark focus:ring-2 focus:ring-rackd-mint/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-rackd-charcoal/40"
      />
    </div>
  );
}

export default function DashboardPage() {
  const { items, addItem, updateItem } = useStore();
  const { query } = useSearch();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [soldItem, setSoldItem] = useState<Item | null>(null);

  const [statusFilter, setStatusFilter] = useState<ItemStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<
    KnownPlatform | "all" | "other"
  >("all");

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
      if (platformFilter === "other") {
        if (!item.listings.some((l) => l.platform === "custom")) return false;
      } else if (
        platformFilter !== "all" &&
        !item.listings.some((l) => l.platform === platformFilter)
      ) {
        return false;
      }
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

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Inventory Value"
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

      <section id="inventory" className="mt-14 scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-rackd-charcoal">
            Inventory
          </h2>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rackd-mint px-5 py-3 text-sm font-semibold text-rackd-charcoal shadow-soft transition-colors hover:bg-rackd-mint-dark"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterSelect
            label="Brand"
            value={brandFilter}
            onChange={setBrandFilter}
            options={[
              { value: "all", label: "All brands" },
              ...brands.map((b) => ({ value: b, label: b })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "sold", label: "Sold" },
            ]}
          />
          <FilterSelect
            label="Platform"
            value={platformFilter}
            onChange={setPlatformFilter}
            options={[
              { value: "all", label: "All platforms" },
              ...PLATFORMS.map((p) => ({
                value: p,
                label: PLATFORM_LABELS[p],
              })),
              { value: "other", label: "Other platforms" },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-card border border-dashed border-rackd-charcoal/15 bg-white py-20 text-center">
            <PackageOpen size={44} className="text-rackd-charcoal/20" />
            <p className="mt-4 font-medium text-rackd-charcoal">No items found</p>
            <p className="text-sm text-rackd-charcoal/50">
              Adjust filters or add your first piece.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onMarkSold={setSoldItem}
                onEdit={setEditItem}
              />
            ))}
          </div>
        )}
      </section>

      <AnalyticsSection items={items} />

      <ItemFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
        onSave={addItem}
      />
      <ItemFormModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        mode="edit"
        item={editItem}
        onSave={(input) => {
          if (editItem) updateItem(editItem.id, input);
        }}
      />
      <MarkSoldModal item={soldItem} onClose={() => setSoldItem(null)} />
    </div>
  );
}
