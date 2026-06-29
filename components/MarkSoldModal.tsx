"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useStore } from "@/lib/store";
import { Item, Platform, PLATFORM_LABELS } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export default function MarkSoldModal({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const { markSold } = useStore();
  const [platformSold, setPlatformSold] = useState<Platform | "">("");
  const [salePrice, setSalePrice] = useState("");

  useEffect(() => {
    if (item) {
      const firstActive = item.listings.find((l) => l.isActive)?.platform;
      setPlatformSold(firstActive ?? item.listings[0]?.platform ?? "");
      setSalePrice(String(item.askingPrice));
    }
  }, [item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !platformSold) return;
    markSold(item.id, platformSold, Number(salePrice) || 0);
    onClose();
  }

  const otherPlatforms =
    item?.listings.filter((l) => l.platform !== platformSold && l.isActive) ??
    [];

  return (
    <Modal open={!!item} onClose={onClose} title="Mark as Sold">
      {item && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-500">
            <span className="font-medium text-slate-700">{item.title}</span> —
            where did it sell?
          </p>

          <div>
            <label className={labelClass}>Sold on platform</label>
            <select
              className={inputClass}
              value={platformSold}
              onChange={(e) => setPlatformSold(e.target.value as Platform)}
              required
            >
              {item.listings.map((l) => (
                <option key={l.platform} value={l.platform}>
                  {PLATFORM_LABELS[l.platform]}
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
            <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm text-orange-700">
              Heads up — you&apos;ll still be listed on{" "}
              <span className="font-semibold">
                {otherPlatforms
                  .map((l) => PLATFORM_LABELS[l.platform])
                  .join(", ")}
              </span>
              . Delist there to avoid double-selling.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Confirm Sale
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
