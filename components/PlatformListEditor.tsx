"use client";

// UI for adding/removing platform rows in the add/edit item form.
import { useState } from "react";
import {
  dedupeListings,
  getListingLabel,
  KNOWN_PLATFORMS,
  listingKey,
  PLATFORM_LABELS,
} from "@/lib/listing-utils";
import { inputClass, labelClass } from "@/lib/ui-styles";
import { ItemListingInput } from "@/lib/types";
import { ChevronDown, Link2, Plus, X } from "lucide-react";

const DRAFT_OTHER = "custom" as const;
type DraftPlatform = (typeof KNOWN_PLATFORMS)[number] | typeof DRAFT_OTHER | "";

interface PlatformListEditorProps {
  listings: ItemListingInput[];
  onChange: (listings: ItemListingInput[]) => void;
}

export default function PlatformListEditor({
  listings,
  onChange,
}: PlatformListEditorProps) {
  const [draftPlatform, setDraftPlatform] = useState<DraftPlatform>("");
  const [draftCustomName, setDraftCustomName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  const existingKeys = new Set(listings.map((l) => listingKey(l)));

  const knownAvailable = KNOWN_PLATFORMS.filter(
    (p) => !existingKeys.has(p)
  );

  function addListing() {
    if (!draftPlatform) return;

    let entry: ItemListingInput | null = null;
    if (draftPlatform === DRAFT_OTHER) {
      const name = draftCustomName.trim();
      if (!name) return;
      entry = {
        platform: "custom",
        customPlatformName: name,
        listingUrl: draftUrl.trim() || undefined,
      };
    } else {
      if (existingKeys.has(draftPlatform)) return;
      entry = {
        platform: draftPlatform,
        listingUrl: draftUrl.trim() || undefined,
      };
    }

    onChange(dedupeListings([...listings, entry]));
    setDraftPlatform("");
    setDraftCustomName("");
    setDraftUrl("");
  }

  function removeListing(key: string) {
    onChange(listings.filter((l) => listingKey(l) !== key));
  }

  function updateUrl(key: string, url: string) {
    onChange(
      listings.map((l) =>
        listingKey(l) === key ? { ...l, listingUrl: url } : l
      )
    );
  }

  const canAdd =
    draftPlatform === DRAFT_OTHER
      ? draftCustomName.trim().length > 0
      : Boolean(draftPlatform);

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-rackd-charcoal/8 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Platform</label>
            <div className="relative">
              <select
                value={draftPlatform}
                onChange={(e) =>
                  setDraftPlatform(e.target.value as DraftPlatform)
                }
                className={`${inputClass} appearance-none pr-10`}
              >
                <option value="">Select where to list…</option>
                {knownAvailable.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
                <option value={DRAFT_OTHER}>Other (custom platform)…</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-rackd-charcoal/40"
              />
            </div>
          </div>

          {draftPlatform === DRAFT_OTHER && (
            <div>
              <label className={labelClass}>Platform name</label>
              <input
                className={inputClass}
                value={draftCustomName}
                onChange={(e) => setDraftCustomName(e.target.value)}
                placeholder="e.g. Grailed, Mercari, Facebook Marketplace"
              />
            </div>
          )}

          <div className={draftPlatform === DRAFT_OTHER ? "sm:col-span-2" : ""}>
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Link2 size={14} />
                Listing URL
              </span>
            </label>
            <input
              className={inputClass}
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              placeholder="https://… paste listing link"
              disabled={!draftPlatform}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addListing}
          disabled={!canAdd}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rackd-charcoal py-2.5 text-sm font-medium text-white transition-colors hover:bg-rackd-charcoal/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5"
        >
          <Plus size={16} />
          Add platform
        </button>
      </div>

      {listings.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-rackd-charcoal/15 bg-white px-4 py-6 text-center text-sm text-rackd-charcoal/45">
          No platforms yet — pick from the dropdown or choose{" "}
          <strong>Other</strong> for Grailed, Mercari, etc.
        </p>
      ) : (
        <ul className="space-y-2">
          {listings.map((l) => {
            const key = listingKey(l);
            return (
              <li
                key={key}
                className="flex flex-col gap-2 rounded-2xl border border-rackd-charcoal/10 bg-white p-3 sm:flex-row sm:items-center"
              >
                <span className="shrink-0 text-sm font-semibold text-rackd-charcoal sm:w-28">
                  {getListingLabel(l)}
                </span>
                <input
                  className={`${inputClass} flex-1 bg-rackd-surface py-2 text-xs sm:text-sm`}
                  value={l.listingUrl ?? ""}
                  onChange={(e) => updateUrl(key, e.target.value)}
                  placeholder={`${getListingLabel(l)} listing URL`}
                />
                <button
                  type="button"
                  onClick={() => removeListing(key)}
                  aria-label={`Remove ${getListingLabel(l)}`}
                  className="self-end rounded-xl p-2 text-rackd-charcoal/45 hover:bg-rackd-charcoal/5 hover:text-rackd-charcoal sm:self-center"
                >
                  <X size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
