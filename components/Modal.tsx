"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

// Reusable modal — Escape closes, backdrop click closes, body scroll locked.
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-rackd-charcoal/30 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col rounded-t-[20px] bg-white shadow-card-hover sm:max-h-[min(90vh,900px)] sm:rounded-[20px] ${
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-rackd-charcoal/8 px-5 py-4 sm:px-6 sm:py-5">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-rackd-charcoal sm:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-rackd-charcoal/40 transition-colors hover:bg-rackd-charcoal/5 hover:text-rackd-charcoal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
