import { Listing } from "@/lib/types";
import { getListingLabel } from "@/lib/listing-utils";
import { platformPillClasses } from "@/lib/platform-styles";

/** Read-only platform chip — strikethrough when listing is inactive (sold/delisted). */
export default function PlatformTag({
  listing,
  muted,
}: {
  listing: Listing;
  muted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${platformPillClasses(listing, { muted })}`}
    >
      {getListingLabel(listing)}
    </span>
  );
}
