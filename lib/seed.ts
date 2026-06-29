import { Item } from "./types";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Seed data so every screen looks full during the demo.
// This stands in for the Aurora PostgreSQL rows until the backend is wired up.
export const SEED_ITEMS: Item[] = [
  {
    id: "itm_001",
    title: "Vintage Carhartt Detroit Jacket",
    brand: "Carhartt",
    size: "L",
    category: "Outerwear",
    condition: "Good",
    cost: 28,
    askingPrice: 145,
    photoUrl:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
    status: "active",
    createdAt: daysAgo(42),
    listings: [
      { platform: "depop", isActive: true },
      { platform: "ebay", isActive: true },
      { platform: "poshmark", isActive: true },
    ],
  },
  {
    id: "itm_002",
    title: "The North Face Nuptse Puffer",
    brand: "The North Face",
    size: "M",
    category: "Outerwear",
    condition: "Like New",
    cost: 55,
    askingPrice: 180,
    photoUrl:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    status: "active",
    createdAt: daysAgo(9),
    listings: [
      { platform: "depop", isActive: true },
      { platform: "vinted", isActive: true },
    ],
  },
  {
    id: "itm_003",
    title: "Levi's 501 Original Jeans",
    brand: "Levi's",
    size: "32x32",
    category: "Bottoms",
    condition: "Good",
    cost: 12,
    askingPrice: 60,
    photoUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    status: "sold",
    createdAt: daysAgo(20),
    listings: [
      { platform: "depop", isActive: true },
      { platform: "poshmark", isActive: true },
      { platform: "vinted", isActive: false },
    ],
    sale: { platformSold: "vinted", salePrice: 58, soldAt: daysAgo(3) },
  },
  {
    id: "itm_004",
    title: "Nike Tech Fleece Hoodie",
    brand: "Nike",
    size: "S",
    category: "Tops",
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
    sale: { platformSold: "depop", salePrice: 82, soldAt: daysAgo(1) },
  },
  {
    id: "itm_005",
    title: "Patagonia Synchilla Fleece",
    brand: "Patagonia",
    size: "M",
    category: "Outerwear",
    condition: "Good",
    cost: 22,
    askingPrice: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    status: "active",
    createdAt: daysAgo(58),
    listings: [
      { platform: "poshmark", isActive: true },
      { platform: "ebay", isActive: true },
    ],
  },
  {
    id: "itm_006",
    title: "Lululemon Define Jacket",
    brand: "Lululemon",
    size: "6",
    category: "Activewear",
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
    ],
  },
  {
    id: "itm_007",
    title: "Adidas Sambas OG",
    brand: "Adidas",
    size: "9",
    category: "Footwear",
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
    category: "Outerwear",
    condition: "New with Tags",
    cost: 25,
    askingPrice: 70,
    photoUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    status: "sold",
    createdAt: daysAgo(26),
    listings: [
      { platform: "poshmark", isActive: true },
      { platform: "ebay", isActive: true },
      { platform: "vinted", isActive: false },
    ],
    sale: { platformSold: "poshmark", salePrice: 68, soldAt: daysAgo(6) },
  },
];
