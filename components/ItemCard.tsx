"use client";

import { Item } from "@/lib/types";
import { formatCurrency, platformsNeedingDelist } from "@/lib/compute";
import PlatformTag from "./PlatformTag";
import { AlertTriangle, Tag } from "lucide-react";

interface ItemCardProps {
  item: Item;
  onMarkSold: (item: Item) => void;
}

export default function ItemCard({ item, onMarkSold }: ItemCardProps) {
  const delistPlatforms = platformsNeedingDelist(item);
  const isSold = item.status === "sold";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.photoUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isSold
              ? "bg-slate-800/90 text-white"
              : "bg-emerald-500/95 text-white"
          }`}
        >
          {isSold ? "Sold" : "Active"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-slate-900 line-clamp-2">
              {item.title}
            </h3>
            <span className="shrink-0 text-lg font-bold text-slate-900">
              {formatCurrency(item.askingPrice)}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {item.brand} · Size {item.size}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.listings.map((l) => (
            <PlatformTag
              key={l.platform}
              platform={l.platform}
              muted={!l.isActive}
            />
          ))}
        </div>

        {isSold && item.sale && (
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Sold on{" "}
            <span className="font-medium capitalize">
              {item.sale.platformSold}
            </span>{" "}
            for {formatCurrency(item.sale.salePrice)}
          </div>
        )}

        {delistPlatforms.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold">Delist from:</span>{" "}
              {delistPlatforms
                .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                .join(", ")}
            </span>
          </div>
        )}

        <div className="mt-auto pt-1">
          {!isSold ? (
            <button
              onClick={() => onMarkSold(item)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Tag size={15} />
              Mark as Sold
            </button>
          ) : (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
              Profit {formatCurrency(item.sale!.salePrice - item.cost)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
