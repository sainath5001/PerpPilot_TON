"use client";

import { HeroOdyssey } from "@/components/ui/hero-odyssey";

const HERO_FEATURES = [
  {
    name: "Risk Engine",
    value: "live health scoring",
    position: "left-0 top-32 sm:left-10 sm:top-40",
  },
  {
    name: "Pro Charts",
    value: "multi-timeframe data",
    position: "left-1/4 top-20 sm:top-24",
  },
  {
    name: "Omniston",
    value: "real RFQ routes",
    position: "right-1/4 top-20 sm:top-24",
  },
  {
    name: "TonConnect",
    value: "non-custodial",
    position: "right-0 top-32 sm:right-10 sm:top-40",
  },
];

export function HeroSection() {
  return (
    <HeroOdyssey
      badge="STON.fi Vibe Coding Hackathon · TON Ecosystem"
      title="PerpPilot"
      subtitle="Risk intelligence before you trade"
      description="A professional perpetual risk terminal — not an exchange. Model liquidation, score position health, and fund collateral via STON.fi Omniston before opening a position."
      features={HERO_FEATURES}
      primaryCta={{ label: "Launch Terminal", href: "/dashboard" }}
      secondaryCta={{ label: "See How It Works", href: "#how-it-works" }}
      defaultHue={165}
    />
  );
}
