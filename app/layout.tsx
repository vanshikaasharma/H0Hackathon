import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "FlipHQ — Reseller Inventory Dashboard",
  description:
    "Manage clothing reseller inventory across Depop, Poshmark, Vinted & eBay. Track profit, avoid double-selling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
