import Link from "next/link";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LandingFooter() {
  return (
    <footer className="mt-28 border-t border-border/60 pb-10 pt-12 lg:mt-36">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500">
            <Activity className="h-4 w-4 text-black" />
          </div>
          <div>
            <p className="font-semibold">PerpPilot TON</p>
            <p className="text-xs text-muted-foreground">
              Built for STON.fi Vibe Coding Hackathon
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="outline" className="text-[10px]">
            TON AppKit
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            Omniston SDK
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            TradingView
          </Badge>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Not financial advice. PerpPilot is a risk analysis tool — not an exchange or custodian.{" "}
        <Link href="#features" className="underline-offset-4 hover:underline">
          Features
        </Link>
        {" · "}
        <Link href="#how-it-works" className="underline-offset-4 hover:underline">
          How it works
        </Link>
      </p>
    </footer>
  );
}
