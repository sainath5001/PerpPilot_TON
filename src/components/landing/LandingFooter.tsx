"use client";

import { Activity, Code2, Globe, Mail } from "lucide-react";
import { ModemAnimatedFooter } from "@/components/ui/modem-animated-footer";

const SOCIAL_LINKS = [
  {
    icon: <Globe className="h-6 w-6" />,
    href: "https://ston.fi",
    label: "STON.fi",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    href: "mailto:hello@perppilot.local",
    label: "Email",
  },
];

const NAV_LINKS = [
  { label: "Platform Flow", href: "#platform-flow" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Dashboard", href: "/dashboard" },
];

export function LandingFooter() {
  return (
    <div className="relative w-full">
      <ModemAnimatedFooter
        brandName="PerpPilot TON"
        brandDescription="Professional perpetual risk terminal for TON traders. Plan positions, score health, and fund collateral via STON.fi Omniston — not an exchange."
        socialLinks={SOCIAL_LINKS}
        navLinks={NAV_LINKS}
        creatorName="STON.fi Hackathon"
        creatorUrl="https://ston.fi"
        brandIcon={
          <Activity className="h-8 w-8 text-black drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
        }
      />
      <p className="relative z-20 mx-auto max-w-2xl px-4 pb-8 text-center text-xs text-muted-foreground">
        Not financial advice. PerpPilot is a risk analysis tool — not an exchange or
        custodian.
      </p>
    </div>
  );
}
