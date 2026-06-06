import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerpPilot TON — Perpetual Risk Terminal",
  description:
    "Professional perpetual trading risk terminal for TON traders. Analyze liquidation metrics, plan collateral, and trade with confidence.",
  keywords: ["TON", "perpetuals", "trading", "risk", "STON.fi", "Omniston"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
