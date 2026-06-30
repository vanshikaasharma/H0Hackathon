"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/lib/search-context";
import RackdLogo from "./RackdLogo";

export default function TopNav() {
  const { query, setQuery } = useSearch();

  return (
    <header className="sticky top-0 z-40 border-b border-rackd-charcoal/8 bg-rackd-surface/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8">
        <div className="flex h-14 items-center gap-3 sm:h-16 sm:gap-4">
          <Link href="/" className="shrink-0">
            <RackdLogo />
          </Link>

          <div className="relative mx-auto hidden min-w-0 max-w-md flex-1 md:block">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rackd-charcoal/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inventory by title or brand…"
              aria-label="Search inventory"
              className="w-full rounded-pill border border-rackd-charcoal/10 bg-white py-2.5 pl-11 pr-4 text-sm text-rackd-charcoal outline-none transition-shadow placeholder:text-rackd-charcoal/40 focus:border-rackd-mint-dark focus:ring-2 focus:ring-rackd-mint/40"
            />
          </div>

          <div
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rackd-mint text-xs font-semibold text-rackd-charcoal ring-2 ring-white sm:h-9 sm:w-9 sm:text-sm"
            title="Your profile"
          >
            VS
          </div>
        </div>

        {/* Mobile / tablet search */}
        <div className="relative pb-3 md:hidden">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rackd-charcoal/40"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory…"
            aria-label="Search inventory"
            className="w-full rounded-pill border border-rackd-charcoal/10 bg-white py-2 pl-10 pr-3 text-sm text-rackd-charcoal outline-none focus:border-rackd-mint-dark focus:ring-2 focus:ring-rackd-mint/40"
          />
        </div>
      </div>
    </header>
  );
}
