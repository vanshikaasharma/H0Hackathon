"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Item, NewItemInput, Platform } from "./types";
import { SEED_ITEMS } from "./seed";

interface StoreValue {
  items: Item[];
  addItem: (input: NewItemInput) => void;
  markSold: (itemId: string, platformSold: Platform, salePrice: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/**
 * Client-side store seeded with demo data.
 *
 * BACKEND SWAP POINT (Person B): replace the in-memory logic below with calls
 * to /api routes backed by Aurora PostgreSQL. The component API (items,
 * addItem, markSold) can stay identical so the UI doesn't need to change.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED_ITEMS);

  const addItem = useCallback((input: NewItemInput) => {
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
      listings: input.platforms.map((platform) => ({
        platform,
        isActive: true,
      })),
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const markSold = useCallback(
    (itemId: string, platformSold: Platform, salePrice: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            status: "sold",
            sale: {
              platformSold,
              salePrice,
              soldAt: new Date().toISOString(),
            },
            // Deactivate the platform it sold on; the rest stay active and
            // surface as "needs delisting" to prevent double-selling.
            listings: item.listings.map((l) =>
              l.platform === platformSold ? { ...l, isActive: false } : l
            ),
          };
        })
      );
    },
    []
  );

  const value = useMemo(
    () => ({ items, addItem, markSold }),
    [items, addItem, markSold]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
