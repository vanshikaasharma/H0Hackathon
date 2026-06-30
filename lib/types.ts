/**
 * TypeScript types for items, listings, and sales.
 * These match the DB tables I plan to use in Aurora (items, listings, sales).
 */

export type KnownPlatform = "depop" | "poshmark" | "vinted" | "ebay";

/** @deprecated use KnownPlatform instead */
export type Platform = KnownPlatform;

export const PLATFORMS: KnownPlatform[] = ["depop", "poshmark", "vinted", "ebay"];

export const PLATFORM_LABELS: Record<KnownPlatform, string> = {
  depop: "Depop",
  poshmark: "Poshmark",
  vinted: "Vinted",
  ebay: "eBay",
};

export type ItemStatus = "active" | "sold";

/** Form/API input before we assign id, isActive, etc. */
export interface ItemListingInput {
  platform: KnownPlatform | "custom";
  customPlatformName?: string;
  listingUrl?: string;
}

/** LISTINGS table row */
export interface Listing {
  platform: KnownPlatform | "custom";
  customPlatformName?: string;
  isActive: boolean;
  listingUrl?: string;
}

/** SALES table row */
export interface Sale {
  /** Matches listingKey() — which listing row sold */
  listingKey: string;
  platformSold: KnownPlatform | "custom";
  customPlatformSold?: string;
  salePrice: number;
  soldAt: string;
}

/** ITEMS table row + embedded relations for the client store */
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
  createdAt: string;
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
  listings: ItemListingInput[];
}
