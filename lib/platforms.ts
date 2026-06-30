import { KnownPlatform } from "./types";

/** Fallback when no per-listing URL was saved (opens platform home). */
export const PLATFORM_HOME: Record<KnownPlatform, string> = {
  depop: "https://www.depop.com/",
  poshmark: "https://poshmark.com/closet",
  vinted: "https://www.vinted.com/",
  ebay: "https://www.ebay.com/sh/lst/active",
};

export function listingHref(
  platform: KnownPlatform | "custom",
  listingUrl?: string
): string {
  const url = listingUrl?.trim();
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  if (platform !== "custom") {
    return PLATFORM_HOME[platform];
  }
  return "#";
}

export function hasDirectListingUrl(listingUrl?: string): boolean {
  const url = listingUrl?.trim();
  return Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));
}
