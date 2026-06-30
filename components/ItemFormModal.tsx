"use client";

// Add / edit item form — shared modal for both flows (mode prop switches title + defaults).
import { useEffect, useState } from "react";
import Modal from "./Modal";
import PlatformListEditor from "./PlatformListEditor";
import { inputClass, labelClass } from "@/lib/ui-styles";
import { Item, ItemListingInput, NewItemInput } from "@/lib/types";
import { Upload } from "lucide-react";

const CONDITIONS = ["New with Tags", "Like New", "Good", "Fair"];
const CATEGORIES = [
  "Jacket",
  "Top",
  "Dress",
  "Pants",
  "Shoes",
  "Accessory",
  "Other",
];

interface ItemFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  item?: Item | null;
  onSave: (input: NewItemInput) => void;
}

function itemToFormState(item: Item) {
  return {
    title: item.title,
    brand: item.brand,
    size: item.size,
    category: item.category,
    condition: item.condition,
    cost: String(item.cost),
    askingPrice: String(item.askingPrice),
    photoUrl: item.photoUrl,
    listings: item.listings.map((l) => ({
      platform: l.platform,
      customPlatformName: l.customPlatformName,
      listingUrl: l.listingUrl,
    })),
  };
}

const emptyForm = {
  title: "",
  brand: "",
  size: "",
  category: CATEGORIES[0],
  condition: CONDITIONS[1],
  cost: "",
  askingPrice: "",
  photoUrl: "",
  listings: [] as ItemListingInput[],
};

export default function ItemFormModal({
  open,
  onClose,
  mode,
  item,
  onSave,
}: ItemFormModalProps) {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[1]);
  const [cost, setCost] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [listings, setListings] = useState<ItemListingInput[]>([]);

  // Reset form when modal opens (edit loads item fields, add clears them).
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && item) {
      const s = itemToFormState(item);
      setTitle(s.title);
      setBrand(s.brand);
      setSize(s.size);
      setCategory(s.category);
      setCondition(s.condition);
      setCost(s.cost);
      setAskingPrice(s.askingPrice);
      setPhotoUrl(s.photoUrl);
      setListings(s.listings);
    } else {
      setTitle(emptyForm.title);
      setBrand(emptyForm.brand);
      setSize(emptyForm.size);
      setCategory(emptyForm.category);
      setCondition(emptyForm.condition);
      setCost(emptyForm.cost);
      setAskingPrice(emptyForm.askingPrice);
      setPhotoUrl(emptyForm.photoUrl);
      setListings(emptyForm.listings);
    }
  }, [open, mode, item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !brand) return;

    onSave({
      title,
      brand,
      size,
      category,
      condition,
      cost: Number(cost) || 0,
      askingPrice: Number(askingPrice) || 0,
      photoUrl,
      listings,
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit Item" : "Add Item"}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4 rounded-2xl bg-rackd-surface p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-rackd-charcoal/50">
            Item details
          </h3>
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vintage Carhartt Detroit Jacket"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Brand</label>
              <input
                className={inputClass}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Carhartt"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Size</label>
              <input
                className={inputClass}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="L"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Condition</label>
              <select
                className={inputClass}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-rackd-surface p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-rackd-charcoal/50">
            Pricing
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Cost ($)</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="28"
              />
            </div>
            <div>
              <label className={labelClass}>Asking Price ($)</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="145"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-rackd-surface p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-rackd-charcoal/50">
            Photo
          </h3>
          <div className="relative">
            <Upload
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rackd-charcoal/35"
            />
            <input
              className={`${inputClass} pl-11`}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Paste image URL (optional)"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-rackd-surface p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-rackd-charcoal/50">
              Where to list
            </h3>
            <p className="mt-1 text-xs text-rackd-charcoal/50">
              Pick Depop, Poshmark, etc. from the dropdown — or choose{" "}
              <strong>Other</strong> and type any platform name (Grailed,
              Mercari, Facebook Marketplace…).
            </p>
          </div>
          <PlatformListEditor listings={listings} onChange={setListings} />
        </section>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-2.5 text-sm font-medium text-rackd-charcoal/70 hover:bg-rackd-charcoal/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-rackd-mint px-6 py-2.5 text-sm font-semibold text-rackd-charcoal transition-colors hover:bg-rackd-mint-dark"
          >
            {mode === "edit" ? "Save Changes" : "Save Item"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
