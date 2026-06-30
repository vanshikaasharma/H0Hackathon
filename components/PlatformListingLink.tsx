import { Listing } from "@/lib/types";
import { getListingLabel } from "@/lib/listing-utils";
import { hasDirectListingUrl, listingHref } from "@/lib/platforms";
import { platformPillClasses } from "@/lib/platform-styles";
import { ExternalLink } from "lucide-react";

interface PlatformListingLinkProps {
  listing: Listing;
  showDirectHint?: boolean;
}

/** Opens the saved listing URL, or the platform home page as fallback. */
export default function PlatformListingLink({
  listing,
  showDirectHint,
}: PlatformListingLinkProps) {
  const direct = hasDirectListingUrl(listing.listingUrl);
  const href = listingHref(listing.platform, listing.listingUrl);
  const label = getListingLabel(listing);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={
        direct
          ? `Open ${label} listing`
          : listing.platform === "custom"
            ? `Open ${label} — paste a listing URL for a direct link`
            : `Open ${label} — add a listing URL when you add items for a direct link`
      }
      className={`inline-flex items-center gap-1 rounded-pill px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors ${platformPillClasses(listing, { interactive: true })} ${
        direct ? "" : "opacity-90"
      }`}
    >
      {label}
      <ExternalLink size={12} className="shrink-0 opacity-70" />
      {showDirectHint && !direct && (
        <span className="sr-only"> (no direct listing URL saved)</span>
      )}
    </a>
  );
}
