"use client";

/**
 * Inventory card in the grid.
 * Delist warnings sit on the photo so every card stays the same height.
 */
import Link from "next/link";
import { Item } from "@/lib/types";
import { formatCurrency, listingsNeedingDelist } from "@/lib/compute";
import { getSaleLabel, listingKey } from "@/lib/listing-utils";
import PlatformTag from "./PlatformTag";
import DelistWarning from "./DelistWarning";
import { inventoryCardClass } from "@/lib/ui-styles";
import { Pencil, Tag } from "lucide-react";

interface ItemCardProps {
  item: Item;
  onMarkSold: (item: Item) => void;
  onEdit: (item: Item) => void;
}

export default function ItemCard({ item, onMarkSold, onEdit }: ItemCardProps) {
  const pendingDelists = listingsNeedingDelist(item);
  const isSold = item.status === "sold";
  const needsDelist = pendingDelists.length > 0;

  return (
    <div className={`group relative flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover ${inventoryCardClass}`}>
      <button
        type="button"
        onClick={() => onEdit(item)}
        aria-label="Edit item"
        className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-rackd-charcoal shadow-soft opacity-100 transition-opacity hover:bg-rackd-mint sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Pencil size={13} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-rackd-charcoal/5">
        <Link href={`/items/${item.id}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photoUrl}
            alt={item.title}
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
              isSold ? "opacity-[0.65]" : ""
            }`}
          />
        </Link>

        {isSold && !needsDelist && (
          <div
            className="pointer-events-none absolute inset-0 bg-white/10"
            aria-hidden
          />
        )}

        {needsDelist && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-rackd-mint/65 via-rackd-mint/20 to-transparent p-2">
            <DelistWarning
              itemId={item.id}
              listings={pendingDelists}
              overlay
            />
          </div>
        )}

        {!isSold && (
          <div className="absolute inset-x-0 bottom-0 z-10 hidden justify-end bg-gradient-to-t from-rackd-charcoal/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
            <button
              type="button"
              onClick={() => onMarkSold(item)}
              className="flex items-center gap-1 rounded-pill bg-white px-2.5 py-1 text-xs font-semibold text-rackd-charcoal shadow-soft"
            >
              <Tag size={12} />
              Sold
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3.5">
        <Link href={`/items/${item.id}`} className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-rackd-charcoal">
            {item.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-rackd-charcoal/55">
            {item.brand} · Size {item.size}
          </p>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-rackd-charcoal">
            {formatCurrency(item.askingPrice)}
          </span>
          <span
            className={`shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isSold
                ? "bg-rackd-charcoal/10 text-rackd-charcoal/60"
                : "bg-rackd-mint text-rackd-charcoal"
            }`}
          >
            {isSold ? "Sold" : "Active"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {item.listings.map((l) => (
            <PlatformTag
              key={listingKey(l)}
              listing={l}
              muted={!l.isActive}
            />
          ))}
        </div>

        {isSold && item.sale && !needsDelist && (
          <p className="truncate text-xs text-rackd-charcoal/55">
            Sold on {getSaleLabel(item.sale)} ·{" "}
            <span className="font-medium text-rackd-charcoal">
              +{formatCurrency(item.sale.salePrice - item.cost)}
            </span>
          </p>
        )}

        {!isSold && (
          <button
            type="button"
            onClick={() => onMarkSold(item)}
            className="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-rackd-charcoal/10 py-1.5 text-xs font-medium text-rackd-charcoal/70 transition-colors hover:border-rackd-mint-dark hover:bg-rackd-mint/30 hover:text-rackd-charcoal sm:hidden"
          >
            <Tag size={13} />
            Mark as Sold
          </button>
        )}
      </div>
    </div>
  );
}
