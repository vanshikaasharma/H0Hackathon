"use client";

import { Listing } from "@/lib/types";
import { listingKey } from "@/lib/listing-utils";
import { AlertTriangle } from "lucide-react";
import PlatformListingLink from "./PlatformListingLink";
import { useStore } from "@/lib/store";
import { hasDirectListingUrl } from "@/lib/platforms";

interface DelistWarningProps {
  itemId: string;
  listings: Listing[];
  compact?: boolean;
  /** Sits on top of the listing photo — keeps card height consistent */
  overlay?: boolean | "detail";
}

export default function DelistWarning({
  itemId,
  listings,
  compact,
  overlay,
}: DelistWarningProps) {
  const { markDelisted } = useStore();

  if (listings.length === 0) return null;

  const allHaveUrls = listings.every((l) => hasDirectListingUrl(l.listingUrl));

  if (overlay) {
    const isDetail = overlay === "detail";
    return (
      <div
        className={`rounded-lg border border-rackd-mint-dark/50 bg-rackd-mint/65 shadow-soft backdrop-blur-sm ${
          isDetail ? "p-3" : "p-2"
        }`}
        role="alert"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-1.5">
          <AlertTriangle
            size={isDetail ? 14 : 12}
            className="shrink-0 text-rackd-charcoal"
          />
          <p
            className={`font-semibold text-rackd-charcoal ${
              isDetail ? "text-xs" : "text-[10px]"
            }`}
          >
            Delist from:
          </p>
        </div>
        <div className={`flex flex-wrap gap-1.5 ${isDetail ? "mt-2" : "mt-1"}`}>
          {listings.map((l) => (
            <PlatformListingLink key={listingKey(l)} listing={l} />
          ))}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            markDelisted(itemId);
          }}
          className={`mt-2 w-full rounded-lg bg-rackd-charcoal font-medium text-white transition-colors hover:bg-rackd-charcoal/90 ${
            isDetail ? "py-1.5 text-xs" : "py-1 text-[10px]"
          }`}
        >
          Mark delisted
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-rackd-mint-dark/40 bg-rackd-mint/30 ${
        compact ? "p-2.5" : "p-5"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          size={compact ? 14 : 20}
          className="mt-0.5 shrink-0 text-rackd-charcoal"
        />
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-rackd-charcoal ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {compact ? "Delist from:" : "Delist from — open each listing:"}
          </p>
          <div className={`flex flex-wrap gap-1.5 ${compact ? "mt-1.5" : "mt-2"}`}>
            {listings.map((l) => (
              <PlatformListingLink key={listingKey(l)} listing={l} />
            ))}
          </div>
          {!compact && (
            <p className="mt-2 text-xs text-rackd-charcoal/60">
              {allHaveUrls
                ? "Click a platform to open that listing in a new tab, remove it there, then mark as delisted below."
                : "Links without a saved listing URL open your seller area on that platform. Paste listing URLs when adding items for direct links."}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => markDelisted(itemId)}
        className={`w-full rounded-xl bg-rackd-charcoal font-medium text-white transition-colors hover:bg-rackd-charcoal/90 ${
          compact ? "mt-2 py-1.5 text-[11px]" : "mt-4 py-3 text-sm"
        }`}
      >
        {compact ? "Mark delisted" : "Mark Platforms as Delisted"}
      </button>
    </div>
  );
}
