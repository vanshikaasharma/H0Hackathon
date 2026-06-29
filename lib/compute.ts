import { Item, Platform, PLATFORM_LABELS } from "./types";

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

// Platforms an item is STILL actively listed on (used for the delist warning).
export function platformsNeedingDelist(item: Item): Platform[] {
  if (item.status !== "sold") return [];
  return item.listings.filter((l) => l.isActive).map((l) => l.platform);
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

export function soldItemsByProfit(items: Item[]): Item[] {
  return items
    .filter((i) => i.status === "sold")
    .sort((a, b) => profit(b) - profit(a));
}

export function formatPlatforms(platforms: Platform[]): string {
  return platforms.map((p) => PLATFORM_LABELS[p]).join(", ");
}

export function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
