import { Item } from "./types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/**
 * Demo inventory — each item shows a different part of the app:
 * - itm_001: normal active item, 3 platforms
 * - itm_002: recently listed active item
 * - itm_003: sold on Vinted, still live on Depop + Poshmark (delist warning)
 * - itm_004: sold + fully delisted (no warning)
 * - itm_005: stale inventory (65 days, shows in analytics)
 * - itm_006: custom platform (Grailed)
 * - itm_007: active shoes, moderate age
 * - itm_008: sold on Poshmark, still live on eBay (delist warning)
 */
export const SEED_ITEMS: Item[] = [
  {
    id: "itm_001",
    title: "Vintage Carhartt Detroit Jacket",
    brand: "Carhartt",
    size: "L",
    category: "Jacket",
    condition: "Good",
    cost: 28,
    askingPrice: 145,
    photoUrl:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
    status: "active",
    createdAt: daysAgo(12),
    listings: [
      {
        platform: "depop",
        isActive: true,
        listingUrl: "https://www.depop.com/products/example-carhartt-jacket",
      },
      {
        platform: "ebay",
        isActive: true,
        listingUrl: "https://www.ebay.com/itm/123456789012",
      },
      {
        platform: "poshmark",
        isActive: true,
        listingUrl: "https://poshmark.com/listing/carhartt-jacket-example",
      },
    ],
  },
  {
    id: "itm_002",
    title: "The North Face Nuptse Puffer",
    brand: "The North Face",
    size: "M",
    category: "Jacket",
    condition: "Like New",
    cost: 55,
    askingPrice: 180,
    photoUrl:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    status: "active",
    createdAt: daysAgo(9),
    listings: [
      {
        platform: "depop",
        isActive: true,
        listingUrl: "https://www.depop.com/products/example-nuptse",
      },
      {
        platform: "vinted",
        isActive: true,
        listingUrl: "https://www.vinted.com/items/example-nuptse",
      },
    ],
  },
  {
    id: "itm_003",
    title: "Levi's 501 Original Jeans",
    brand: "Levi's",
    size: "32x32",
    category: "Pants",
    condition: "Good",
    cost: 12,
    askingPrice: 60,
    photoUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    status: "sold",
    createdAt: daysAgo(20),
    listings: [
      {
        platform: "depop",
        isActive: true,
        listingUrl: "https://www.depop.com/products/example-levis-501",
      },
      {
        platform: "poshmark",
        isActive: true,
        listingUrl: "https://poshmark.com/listing/levis-501-example",
      },
      {
        platform: "vinted",
        isActive: false,
        listingUrl: "https://www.vinted.com/items/example-levis",
      },
    ],
    sale: {
      listingKey: "vinted",
      platformSold: "vinted",
      salePrice: 58,
      soldAt: daysAgo(3),
    },
  },
  {
    id: "itm_004",
    title: "Nike Tech Fleece Hoodie",
    brand: "Nike",
    size: "S",
    category: "Top",
    condition: "Like New",
    cost: 30,
    askingPrice: 85,
    photoUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    status: "sold",
    createdAt: daysAgo(15),
    listings: [
      { platform: "depop", isActive: false },
      { platform: "ebay", isActive: false },
    ],
    sale: {
      listingKey: "depop",
      platformSold: "depop",
      salePrice: 82,
      soldAt: daysAgo(1),
    },
  },
  {
    id: "itm_005",
    title: "Patagonia Synchilla Fleece",
    brand: "Patagonia",
    size: "M",
    category: "Jacket",
    condition: "Good",
    cost: 22,
    askingPrice: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    status: "active",
    createdAt: daysAgo(65),
    listings: [
      {
        platform: "poshmark",
        isActive: true,
        listingUrl: "https://poshmark.com/listing/patagonia-fleece",
      },
      {
        platform: "ebay",
        isActive: true,
        listingUrl: "https://www.ebay.com/itm/987654321098",
      },
    ],
  },
  {
    id: "itm_006",
    title: "Lululemon Define Jacket",
    brand: "Lululemon",
    size: "6",
    category: "Jacket",
    condition: "Like New",
    cost: 35,
    askingPrice: 78,
    photoUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    status: "active",
    createdAt: daysAgo(4),
    listings: [
      { platform: "poshmark", isActive: true },
      { platform: "depop", isActive: true },
      { platform: "vinted", isActive: true },
      {
        platform: "custom",
        customPlatformName: "Grailed",
        isActive: true,
        listingUrl: "https://www.grailed.com/listings/example-lululemon",
      },
    ],
  },
  {
    id: "itm_007",
    title: "Adidas Sambas OG",
    brand: "Adidas",
    size: "9",
    category: "Shoes",
    condition: "Good",
    cost: 40,
    askingPrice: 110,
    photoUrl:
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&q=80",
    status: "active",
    createdAt: daysAgo(31),
    listings: [
      { platform: "depop", isActive: true },
      { platform: "ebay", isActive: true },
    ],
  },
  {
    id: "itm_008",
    title: "Zara Wool Blend Overcoat",
    brand: "Zara",
    size: "M",
    category: "Jacket",
    condition: "New with Tags",
    cost: 25,
    askingPrice: 70,
    photoUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    status: "sold",
    createdAt: daysAgo(26),
    listings: [
      {
        platform: "poshmark",
        isActive: false,
        listingUrl: "https://poshmark.com/listing/zara-overcoat",
      },
      {
        platform: "ebay",
        isActive: true,
        listingUrl: "https://www.ebay.com/itm/555666777888",
      },
      {
        platform: "vinted",
        isActive: false,
        listingUrl: "https://www.vinted.com/items/zara-coat",
      },
    ],
    sale: {
      listingKey: "poshmark",
      platformSold: "poshmark",
      salePrice: 68,
      soldAt: daysAgo(6),
    },
  },
];
