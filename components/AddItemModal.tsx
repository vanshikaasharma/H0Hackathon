"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useStore } from "@/lib/store";
import { Platform, PLATFORMS, PLATFORM_LABELS } from "@/lib/types";

const CONDITIONS = ["New with Tags", "Like New", "Good", "Fair"];

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export default function AddItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addItem } = useStore();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[1]);
  const [cost, setCost] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  function reset() {
    setTitle("");
    setBrand("");
    setSize("");
    setCategory("");
    setCondition(CONDITIONS[1]);
    setCost("");
    setAskingPrice("");
    setPhotoUrl("");
    setPlatforms([]);
  }

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !brand) return;
    addItem({
      title,
      brand,
      size,
      category,
      condition,
      cost: Number(cost) || 0,
      askingPrice: Number(askingPrice) || 0,
      photoUrl,
      platforms,
    });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Item">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-3">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Outerwear"
            />
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

        <div className="grid grid-cols-2 gap-3">
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

        <div>
          <label className={labelClass}>Photo URL</label>
          <input
            className={inputClass}
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://… (optional)"
          />
        </div>

        <div>
          <label className={labelClass}>Listed on</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const selected = platforms.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              );
            })}
          </div>
        </div>

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
            Add Item
          </button>
        </div>
      </form>
    </Modal>
  );
}
