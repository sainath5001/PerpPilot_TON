"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { TerminalPreview } from "@/components/landing/TerminalPreview";

export function HeroSection() {
  return (
    <section className="relative pt-12 lg:pt-20">
      <FadeIn>
        <div className="flex flex-col items-center text-center">
          <Badge variant="success" className="mb-6 px-3 py-1">
            <Sparkles className="mr-1.5 h-3 w-3" />
            STON.fi Vibe Coding Hackathon · TON Ecosystem
          </Badge>

          <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Plan perpetual trades with{" "}
            <span className="text-gradient-brand">institutional-grade</span>{" "}
            risk intelligence
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            PerpPilot TON is a professional risk terminal — not an exchange.
            Model liquidation, score position health, and fund collateral via
            STON.fi Omniston before you ever open a position.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button variant="trading" size="lg" asChild className="min-w-[180px]">
              <Link href="/dashboard">
                Launch Terminal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="min-w-[180px]">
              <Link href="#how-it-works">
                See How It Works
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Tonkeeper · TON AppKit · Omniston SDK · No custody
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={200} className="mt-16 lg:mt-20">
        <TerminalPreview />
      </FadeIn>
    </section>
  );
}
