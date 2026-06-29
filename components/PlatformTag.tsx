import { Platform, PLATFORM_LABELS } from "@/lib/types";

const STYLES: Record<Platform, string> = {
  depop: "bg-red-50 text-red-600",
  poshmark: "bg-pink-50 text-pink-600",
  vinted: "bg-teal-50 text-teal-600",
  ebay: "bg-blue-50 text-blue-600",
};

export default function PlatformTag({
  platform,
  muted,
}: {
  platform: Platform;
  muted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
        muted ? "bg-slate-100 text-slate-400 line-through" : STYLES[platform]
      }`}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  );
}
