/**
 * Helpers for listing keys and labels.
 * listingKey() gives each platform row a stable id (e.g. "depop" or "custom:grailed").
 */
import {
  ItemListingInput,
  KnownPlatform,
  Listing,
  PLATFORMS,
  PLATFORM_LABELS,
  Sale,
} from "./types";

export { PLATFORM_LABELS };
export const KNOWN_PLATFORMS = PLATFORMS;

type ListingLike = {
  platform: KnownPlatform | "custom";
  customPlatformName?: string;
};

/** Stable id for matching listings (known slug or custom:name). */
export function listingKey(listing: ListingLike): string {
  if (listing.platform === "custom") {
    const name = listing.customPlatformName?.trim().toLowerCase() ?? "";
    return `custom:${name}`;
  }
  return listing.platform;
}

export function getListingLabel(listing: ListingLike): string {
  if (listing.platform === "custom") {
    return listing.customPlatformName?.trim() || "Other";
  }
  return PLATFORM_LABELS[listing.platform];
}

export function getSaleLabel(sale: Sale): string {
  if (sale.platformSold === "custom") {
    return sale.customPlatformSold?.trim() || "Other";
  }
  return PLATFORM_LABELS[sale.platformSold];
}

export function normalizeListingInput(
  input: ItemListingInput
): ItemListingInput | null {
  if (input.platform === "custom") {
    const name = input.customPlatformName?.trim();
    if (!name) return null;
    return {
      platform: "custom",
      customPlatformName: name,
      listingUrl: input.listingUrl?.trim() || undefined,
    };
  }
  return {
    platform: input.platform,
    listingUrl: input.listingUrl?.trim() || undefined,
  };
}

export function dedupeListings(
  listings: ItemListingInput[]
): ItemListingInput[] {
  const seen = new Set<string>();
  const out: ItemListingInput[] = [];
  for (const raw of listings) {
    const l = normalizeListingInput(raw);
    if (!l) continue;
    const key = listingKey(l);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

export function toListing(input: ItemListingInput, isActive: boolean): Listing {
  const normalized = normalizeListingInput(input);
  if (!normalized) {
    throw new Error("Invalid listing input");
  }
  return {
    platform: normalized.platform,
    customPlatformName:
      normalized.platform === "custom"
        ? normalized.customPlatformName
        : undefined,
    isActive,
    listingUrl: normalized.listingUrl,
  };
}
