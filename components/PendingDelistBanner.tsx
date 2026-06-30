"use client";

import { countItemsNeedingDelist } from "@/lib/compute";
import { useStore } from "@/lib/store";
import { AlertTriangle } from "lucide-react";

export default function PendingDelistBanner() {
  const { items } = useStore();
  const count = countItemsNeedingDelist(items);

  if (count === 0) return null;

  function scrollToInventory() {
    document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToInventory}
      className="w-full border-b border-rackd-mint-dark/30 bg-rackd-mint/25 text-left transition-colors hover:bg-rackd-mint/35"
      role="status"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3 md:px-8">
        <AlertTriangle size={18} className="shrink-0 text-rackd-charcoal" />
        <p className="text-sm text-rackd-charcoal">
          <span className="font-semibold">
            {count} item{count !== 1 ? "s" : ""} need delisting
          </span>
          {" — "}
          sold on one platform but still live elsewhere. Tap to jump to inventory.
        </p>
      </div>
    </button>
  );
}
