"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { dedupeListings, listingKey, toListing } from "./listing-utils";
import { Item, Listing, NewItemInput } from "./types";
import { SEED_ITEMS } from "./seed";

/**
 * Client-side inventory state (React Context).
 * For now everything lives in memory — later this will fetch from /api and Aurora.
 */
interface StoreValue {
  items: Item[];
  addItem: (input: NewItemInput) => void;
  updateItem: (itemId: string, input: NewItemInput) => void;
  markSold: (itemId: string, soldListingKey: string, salePrice: number) => void;
  markDelisted: (itemId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/**
 * Holds all items in state. Components call useStore() to read/update inventory.
 * TODO: replace useState(SEED_ITEMS) with API calls once Aurora is wired up.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED_ITEMS);

  const addItem = useCallback((input: NewItemInput) => {
    const listings = dedupeListings(input.listings).map((l) =>
      toListing(l, true)
    );

    const newItem: Item = {
      id: `itm_${Math.random().toString(36).slice(2, 8)}`,
      title: input.title,
      brand: input.brand,
      size: input.size,
      category: input.category,
      condition: input.condition,
      cost: input.cost,
      askingPrice: input.askingPrice,
      photoUrl:
        input.photoUrl ||
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
      status: "active",
      createdAt: new Date().toISOString(),
      listings,
    };

    // Prepend so newest inventory appears first in the grid
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((itemId: string, input: NewItemInput) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        // Preserve isActive per listing when user edits platforms/URLs
        const existingByKey = new Map<string, Listing>(
          item.listings.map((l) => [listingKey(l), l])
        );

        const listings = dedupeListings(input.listings).map((l) => {
          const existing = existingByKey.get(listingKey(l));
          return toListing(l, existing?.isActive ?? true);
        });

        return {
          ...item,
          title: input.title,
          brand: input.brand,
          size: input.size,
          category: input.category,
          condition: input.condition,
          cost: input.cost,
          askingPrice: input.askingPrice,
          photoUrl:
            input.photoUrl.trim() ||
            item.photoUrl ||
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
          listings,
        };
      })
    );
  }, []);

  /**
   * When something sells on one platform, mark that listing inactive.
   * Other listings stay active until the user manually marks them delisted.
   */
  const markSold = useCallback(
    (itemId: string, soldListingKey: string, salePrice: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;

          const soldListing = item.listings.find(
            (l) => listingKey(l) === soldListingKey
          );
          if (!soldListing) return item;

          return {
            ...item,
            status: "sold",
            sale: {
              listingKey: soldListingKey,
              platformSold: soldListing.platform,
              customPlatformSold: soldListing.customPlatformName,
              salePrice,
              soldAt: new Date().toISOString(),
            },
            listings: item.listings.map((l) =>
              listingKey(l) === soldListingKey ? { ...l, isActive: false } : l
            ),
          };
        })
      );
    },
    []
  );

  /** User confirmed they removed the item from all remaining platforms. */
  const markDelisted = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          listings: item.listings.map((l) => ({ ...l, isActive: false })),
        };
      })
    );
  }, []);

  // Memoize so child components don't re-render unless items/actions change
  const value = useMemo(
    () => ({ items, addItem, updateItem, markSold, markDelisted }),
    [items, addItem, updateItem, markSold, markDelisted]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Must be used inside StoreProvider (see layout.tsx). */
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
