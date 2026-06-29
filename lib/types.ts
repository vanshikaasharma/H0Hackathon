export type Platform = "depop" | "poshmark" | "vinted" | "ebay";

export const PLATFORMS: Platform[] = ["depop", "poshmark", "vinted", "ebay"];

export const PLATFORM_LABELS: Record<Platform, string> = {
  depop: "Depop",
  poshmark: "Poshmark",
  vinted: "Vinted",
  ebay: "eBay",
};

export type ItemStatus = "active" | "sold";

// Maps to the LISTINGS table (one item -> many listings)
export interface Listing {
  platform: Platform;
  isActive: boolean;
}

// Maps to the SALES table (one item -> one sale)
export interface Sale {
  platformSold: Platform;
  salePrice: number;
  soldAt: string; // ISO date
}

// Maps to the ITEMS table, with related listings/sale embedded for the UI
export interface Item {
  id: string;
  title: string;
  brand: string;
  size: string;
  category: string;
  condition: string;
  cost: number;
  askingPrice: number;
  photoUrl: string;
  status: ItemStatus;
  createdAt: string; // ISO date
  listings: Listing[];
  sale?: Sale;
}

export interface NewItemInput {
  title: string;
  brand: string;
  size: string;
  category: string;
  condition: string;
  cost: number;
  askingPrice: number;
  photoUrl: string;
  platforms: Platform[];
}
