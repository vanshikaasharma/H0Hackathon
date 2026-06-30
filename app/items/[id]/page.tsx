"use client";

// Single item view — photo on the left, details on the right (stacks on mobile).
import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import {
  formatCurrency,
  listingsNeedingDelist,
  profit,
} from "@/lib/compute";
import { getSaleLabel, listingKey } from "@/lib/listing-utils";
import { Item } from "@/lib/types";
import PlatformTag from "@/components/PlatformTag";
import PlatformListingLink from "@/components/PlatformListingLink";
import DelistWarning from "@/components/DelistWarning";
import MarkSoldModal from "@/components/MarkSoldModal";
import ItemFormModal from "@/components/ItemFormModal";
import { inventoryCardClass } from "@/lib/ui-styles";
import { ArrowLeft, Pencil, Tag, TrendingUp } from "lucide-react";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const { items, updateItem } = useStore();
  const [soldOpen, setSoldOpen] = useState<Item | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const item = useMemo(
    () => items.find((i) => i.id === params.id),
    [items, params.id]
  );

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
        <p className="text-lg font-medium text-rackd-charcoal">Item not found</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rackd-charcoal/70 hover:text-rackd-charcoal"
        >
          <ArrowLeft size={16} />
          Back to inventory
        </Link>
      </div>
    );
  }

  const isSold = item.status === "sold";
  const pendingDelists = listingsNeedingDelist(item);
  const estimatedProfit = item.askingPrice - item.cost;
  const displayProfit =
    isSold && item.sale ? profit(item) : estimatedProfit;
  const needsDelist = pendingDelists.length > 0;
  const isFullyDelisted = isSold && !needsDelist;

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-rackd-charcoal/55 transition-colors hover:text-rackd-charcoal"
      >
        <ArrowLeft size={16} />
        Back to inventory
      </Link>

      <div className={inventoryCardClass}>
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          {/* Photo — fills left column height on desktop (no gap below) */}
          <div className="relative max-lg:aspect-square lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photoUrl}
              alt={item.title}
              className={`h-full w-full object-cover max-lg:aspect-square lg:absolute lg:inset-0 ${
                isSold ? "opacity-[0.65]" : ""
              }`}
            />
            {isSold && (
              <div
                className="pointer-events-none absolute inset-0 bg-rackd-charcoal/10"
                aria-hidden
              />
            )}
            {isSold && (
              <span className="absolute left-4 top-4 z-10 rounded-pill bg-rackd-charcoal/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Sold
              </span>
            )}
            {needsDelist && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-rackd-mint/65 via-rackd-mint/20 to-transparent p-3 sm:p-4">
                <DelistWarning
                  itemId={item.id}
                  listings={pendingDelists}
                  overlay="detail"
                />
              </div>
            )}
            {isFullyDelisted && (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-rackd-mint/65 via-rackd-mint/20 to-transparent p-3 sm:p-4">
                <div className="rounded-lg border border-rackd-mint-dark/50 bg-rackd-mint/65 px-4 py-3 text-center text-sm font-medium text-rackd-charcoal shadow-soft backdrop-blur-sm">
                  Fully delisted on all platforms
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 border-t-2 border-rackd-charcoal p-4 sm:p-5 lg:border-l-2 lg:border-t-0">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`inline-flex rounded-pill px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isSold
                  ? "bg-rackd-charcoal/10 text-rackd-charcoal/65"
                  : "bg-rackd-mint text-rackd-charcoal"
              }`}
            >
              {isSold ? "Sold" : "Active"}
            </span>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Edit item"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-rackd-charcoal/15 bg-white px-3 py-1.5 text-sm font-medium text-rackd-charcoal transition-colors hover:border-rackd-charcoal hover:bg-rackd-mint/30"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-rackd-charcoal sm:text-3xl">
              {item.title}
            </h1>
            <p className="mt-1.5 text-sm text-rackd-charcoal/55">
              {item.brand} · Size {item.size}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl bg-rackd-surface p-4 sm:grid-cols-3">
            {[
              ["Category", item.category],
              ["Condition", item.condition],
              ["Cost", formatCurrency(item.cost)],
              ["Asking price", formatCurrency(item.askingPrice)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-rackd-charcoal/45">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-rackd-charcoal">
                  {value}
                </dd>
              </div>
            ))}
            <div className="col-span-2 rounded-xl bg-rackd-mint/40 px-3 py-2.5 sm:col-span-1">
              <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-rackd-charcoal/55">
                <TrendingUp size={11} />
                {isSold ? "Profit" : "Est. profit"}
              </dt>
              <dd className="mt-0.5 text-lg font-bold text-rackd-charcoal">
                {formatCurrency(displayProfit)}
              </dd>
            </div>
          </dl>

          {isSold && item.sale && (
            <div className="rounded-xl border border-rackd-charcoal/10 bg-rackd-surface px-4 py-3 text-sm text-rackd-charcoal/70">
              Sold on{" "}
              <span className="font-semibold text-rackd-charcoal">
                {getSaleLabel(item.sale)}
              </span>{" "}
              for{" "}
              <span className="font-semibold text-rackd-charcoal">
                {formatCurrency(item.sale.salePrice)}
              </span>
            </div>
          )}

          <div className="border-t border-rackd-charcoal/8 pt-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-rackd-charcoal/45">
              Listed on
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.listings.map((l) =>
                l.isActive && l.listingUrl ? (
                  <PlatformListingLink key={listingKey(l)} listing={l} />
                ) : (
                  <PlatformTag
                    key={listingKey(l)}
                    listing={l}
                    muted={!l.isActive}
                  />
                )
              )}
            </div>
          </div>


          {!isSold && (
            <button
              type="button"
              onClick={() => setSoldOpen(item)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rackd-charcoal py-3 text-sm font-semibold text-white transition-colors hover:bg-rackd-charcoal/90"
            >
              <Tag size={17} />
              Mark as Sold
            </button>
          )}
          </div>
        </div>
      </div>

      <MarkSoldModal item={soldOpen} onClose={() => setSoldOpen(null)} />
      <ItemFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        item={item}
        onSave={(input) => updateItem(item.id, input)}
      />
    </div>
  );
}
