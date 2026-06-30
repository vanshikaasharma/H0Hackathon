import { getListingLabel } from "./listing-utils";
import { Item, Listing } from "./types";

// Stats helpers — kept separate from React so they're easy to test.

export function profit(item: Item): number {
  if (item.status !== "sold" || !item.sale) return 0;
  return item.sale.salePrice - item.cost;
}

export interface DashboardStats {
  inventoryValue: number;
  totalProfit: number;
  activeCount: number;
  soldCount: number;
}

export function computeStats(items: Item[]): DashboardStats {
  return items.reduce<DashboardStats>(
    (acc, item) => {
      if (item.status === "active") {
        acc.inventoryValue += item.askingPrice;
        acc.activeCount += 1;
      } else {
        acc.totalProfit += profit(item);
        acc.soldCount += 1;
      }
      return acc;
    },
    { inventoryValue: 0, totalProfit: 0, activeCount: 0, soldCount: 0 }
  );
}

// Listings still active after a sale — includes listingUrl for delist links.
export function listingsNeedingDelist(item: Item): Listing[] {
  if (item.status !== "sold") return [];
  return item.listings.filter((l) => l.isActive);
}

export function countItemsNeedingDelist(items: Item[]): number {
  return items.filter((i) => listingsNeedingDelist(i).length > 0).length;
}

export interface BrandStat {
  brand: string;
  soldCount: number;
  profit: number;
}

export function bestSellingBrands(items: Item[]): BrandStat[] {
  const map = new Map<string, BrandStat>();
  for (const item of items) {
    if (item.status !== "sold") continue;
    const existing = map.get(item.brand) ?? {
      brand: item.brand,
      soldCount: 0,
      profit: 0,
    };
    existing.soldCount += 1;
    existing.profit += profit(item);
    map.set(item.brand, existing);
  }
  return [...map.values()].sort((a, b) => b.profit - a.profit);
}

export function daysListed(item: Item): number {
  const created = new Date(item.createdAt).getTime();
  return Math.max(0, Math.floor((Date.now() - created) / 86_400_000));
}

// Active items listed the longest without selling ("stale inventory").
export function staleInventory(items: Item[]): Item[] {
  return items
    .filter((i) => i.status === "active")
    .sort((a, b) => daysListed(b) - daysListed(a));
}

export function staleInventoryOverDays(
  items: Item[],
  minDays = 60
): Item[] {
  return staleInventory(items).filter((i) => daysListed(i) >= minDays);
}

export interface MonthlyProfit {
  label: string;
  profit: number;
}

export function profitOverTime(items: Item[]): MonthlyProfit[] {
  const map = new Map<string, number>();
  for (const item of items) {
    if (item.status !== "sold" || !item.sale) continue;
    const d = new Date(item.sale.soldAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + profit(item));
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, profitTotal]) => {
      const [year, month] = key.split("-");
      const label = new Date(Number(year), Number(month) - 1).toLocaleString(
        "en-US",
        { month: "short" }
      );
      return { label, profit: profitTotal };
    });
}

// Fill in months with $0 so the chart doesn't look empty when sales are sparse.
export function profitChartLast6Months(items: Item[]): MonthlyProfit[] {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" }),
    });
  }

  const profitMap = new Map<string, number>();
  for (const item of items) {
    if (item.status !== "sold" || !item.sale) continue;
    const d = new Date(item.sale.soldAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    profitMap.set(key, (profitMap.get(key) ?? 0) + profit(item));
  }

  return months.map((m) => ({
    label: m.label,
    profit: profitMap.get(m.key) ?? 0,
  }));
}

export function soldItemsByProfit(items: Item[]): Item[] {
  return items
    .filter((i) => i.status === "sold")
    .sort((a, b) => profit(b) - profit(a));
}

export function formatListings(listings: Listing[]): string {
  return listings.map((l) => getListingLabel(l)).join(", ");
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
