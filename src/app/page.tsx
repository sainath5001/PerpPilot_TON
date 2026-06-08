"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  EcosystemMarqueeSection,
  HeroSection,
  HowItWorksSection,
  LandingFooter,
  TestimonialsSection,
  PlatformFlowSection,
} from "@/components/landing";
import { TopNav } from "@/components/layout/TopNav";
import { FadeIn } from "@/components/ui/fade-in";

function AuthBanner() {
  const searchParams = useSearchParams();
  const authRequired = searchParams.get("auth") === "required";

  if (!authRequired) return null;

  return (
    <FadeIn>
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        Connect your TON wallet to access the protected risk dashboard.
      </div>
    </FadeIn>
  );
}

function LandingContent() {
  return (
    <div className="relative min-h-screen bg-background">
      <TopNav />

      <Suspense fallback={null}>
        <div className="relative z-30 mx-auto max-w-6xl px-4 pt-4 lg:px-6">
          <AuthBanner />
        </div>
      </Suspense>

      <HeroSection />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
          <div className="absolute -right-32 top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-3xl" />
        </div>

        <main className="relative mx-auto max-w-6xl px-4 pb-28 lg:pb-12 lg:px-6">
          <PlatformFlowSection />
          <HowItWorksSection />
          <EcosystemMarqueeSection />
          <TestimonialsSection />
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}

function LandingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      <p className="text-sm text-muted-foreground">Loading PerpPilot…</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <LandingContent />
    </Suspense>
  );
}
