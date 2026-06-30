"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useStore } from "@/lib/store";
import { getListingLabel, listingKey } from "@/lib/listing-utils";
import { inputClass, labelClass } from "@/lib/ui-styles";
import { Item } from "@/lib/types";
import PlatformTag from "./PlatformTag";

export default function MarkSoldModal({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const { markSold } = useStore();
  const [soldListingKey, setSoldListingKey] = useState("");
  const [salePrice, setSalePrice] = useState("");

  useEffect(() => {
    if (item) {
      const firstActive = item.listings.find((l) => l.isActive);
      const first = firstActive ?? item.listings[0];
      setSoldListingKey(first ? listingKey(first) : "");
      setSalePrice(String(item.askingPrice));
    }
  }, [item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !soldListingKey) return;
    markSold(item.id, soldListingKey, Number(salePrice) || 0);
    onClose();
  }

  const otherPlatforms =
    item?.listings.filter(
      (l) => listingKey(l) !== soldListingKey && l.isActive
    ) ?? [];

  return (
    <Modal open={!!item} onClose={onClose} title="Mark as Sold">
      {item && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-rackd-charcoal/60">
            <span className="font-semibold text-rackd-charcoal">{item.title}</span>
            {" "}— where did it sell?
          </p>

          <div>
            <label className={labelClass}>Sold on platform</label>
            <select
              className={inputClass}
              value={soldListingKey}
              onChange={(e) => setSoldListingKey(e.target.value)}
              required
            >
              {item.listings.map((l) => (
                <option key={listingKey(l)} value={listingKey(l)}>
                  {getListingLabel(l)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Final sale price ($)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              required
            />
          </div>

          {otherPlatforms.length > 0 && (
            <div className="rounded-2xl border border-rackd-mint-dark/40 bg-rackd-mint/25 p-4">
              <p className="text-sm font-medium text-rackd-charcoal">
                You&apos;ll still be listed on:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {otherPlatforms.map((l) => (
                  <PlatformTag key={listingKey(l)} listing={l} />
                ))}
              </div>
              <p className="mt-2 text-xs text-rackd-charcoal/55">
                Delist manually on those platforms after confirming the sale.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-5 py-2.5 text-sm font-medium text-rackd-charcoal/70 hover:bg-rackd-charcoal/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-rackd-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-rackd-charcoal/90"
            >
              Confirm Sale
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
