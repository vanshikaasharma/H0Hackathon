import { LucideIcon } from "lucide-react";
import { panelCardClass } from "@/lib/ui-styles";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <div
      className={`p-6 transition-shadow hover:shadow-soft ${panelCardClass} ${
        accent ? "border-rackd-mint/60 bg-gradient-to-br from-white to-rackd-mint/20" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-rackd-charcoal/60">{label}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            accent
              ? "bg-rackd-mint text-rackd-charcoal"
              : "bg-rackd-charcoal/5 text-rackd-charcoal/70"
          }`}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-rackd-charcoal sm:mt-4 sm:text-3xl md:text-4xl">
        {value}
      </p>
    </div>
  );
}
