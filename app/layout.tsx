import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import PendingDelistBanner from "@/components/PendingDelistBanner";
import { StoreProvider } from "@/lib/store";
import { SearchProvider } from "@/lib/search-context";

/**
 * Root layout — StoreProvider holds inventory, SearchProvider holds nav search text.
 */

export const metadata: Metadata = {
  title: "Rackd — Reseller Inventory Dashboard",
  description:
    "Inventory dashboard for clothing resellers on Depop, Poshmark, Vinted, and eBay.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-rackd-surface font-sans antialiased">
        <StoreProvider>
          <SearchProvider>
            <TopNav />
            <PendingDelistBanner />
            <main>{children}</main>
          </SearchProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
