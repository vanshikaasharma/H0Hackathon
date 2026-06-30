import { KnownPlatform, Listing } from "./types";

/**
 * Platform pill colors — one source of truth for PlatformTag + PlatformListingLink.
 * Known platforms get brand-ish tints; custom platforms (Grailed, etc.) use violet.
 */

const KNOWN_BASE: Record<KnownPlatform, string> = {
  depop: "bg-rose-50 text-rose-700 ring-rose-100",
  poshmark: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  vinted: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  ebay: "bg-sky-50 text-sky-700 ring-sky-100",
};

const KNOWN_HOVER: Record<KnownPlatform, string> = {
  depop: "hover:bg-rose-100",
  poshmark: "hover:bg-fuchsia-100",
  vinted: "hover:bg-cyan-100",
  ebay: "hover:bg-sky-100",
};

const CUSTOM_BASE = "bg-violet-50 text-violet-700 ring-violet-100";
const CUSTOM_HOVER = "hover:bg-violet-100";

type ListingPlatform = Pick<Listing, "platform">;

export function platformPillClasses(
  listing: ListingPlatform,
  opts?: { muted?: boolean; interactive?: boolean }
): string {
  if (opts?.muted) {
    return "bg-rackd-charcoal/5 text-rackd-charcoal/35 line-through ring-transparent";
  }

  if (listing.platform === "custom") {
    return opts?.interactive
      ? `${CUSTOM_BASE} ${CUSTOM_HOVER}`
      : CUSTOM_BASE;
  }

  const base = KNOWN_BASE[listing.platform];
  return opts?.interactive
    ? `${base} ${KNOWN_HOVER[listing.platform]}`
    : base;
}
