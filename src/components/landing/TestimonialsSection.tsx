"use client";

import { motion } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import type { Testimonial } from "@/components/ui/testimonials-columns";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";

const TESTIMONIALS: Testimonial[] = [
  {
    text: "PerpPilot caught a liquidation risk I completely missed. The health score and margin buffer update live as I tweak leverage — exactly what I needed before opening a TON perp.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    name: "Alex Chen",
    role: "TON Perp Trader",
  },
  {
    text: "Finally a terminal that sits upstream of the exchange. I plan trades here, fund USDT via Omniston, then execute on my venue with confidence.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    name: "Maria Santos",
    role: "DeFi Analyst",
  },
  {
    text: "The chart + risk engine combo feels like GMX/Hyperliquid quality, but built for TON. Multi-timeframe BTC and TON data without leaving the dashboard.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    name: "James Okonkwo",
    role: "Swing Trader",
  },
  {
    text: "Omniston integration is the real deal — live RFQ, route breakdown, TonConnect signing. No mocks, no fake quotes. Collateral funding just works.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    name: "Elena Volkov",
    role: "STON.fi User",
  },
  {
    text: "I use OKX wallet with TonConnect and the flow is seamless. Connect once, analyze risk, fund if needed. The trade planner saves me from bad entries.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    name: "David Park",
    role: "Crypto Portfolio Manager",
  },
  {
    text: "Liquidation price and R:R ratios updating in real time changed how I size positions. This is institutional-grade tooling for retail TON traders.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    name: "Sofia Martinez",
    role: "Risk Manager",
  },
  {
    text: "Built for the STON.fi hackathon but feels production-ready. Clean UI, fast charts, and the orbital platform flow explains the product instantly.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop",
    name: "Ryan Mitchell",
    role: "Hackathon Judge",
  },
  {
    text: "Non-custodial by design — my keys never left OKX. PerpPilot only helps me decide; I still execute where I want. That's the right model.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    name: "Yuki Tanaka",
    role: "TON Community Member",
  },
  {
    text: "Slippage preview and minimum received on Omniston swaps gave me peace of mind funding collateral. Way better than guessing on a DEX UI.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    name: "Amara Okafor",
    role: "Liquidity Provider",
  },
];

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative mt-28 lg:mt-36">
      <FadeIn>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <SectionHeader
            badge="Testimonials"
            title="What TON traders are saying"
            description="PerpPilot helps traders plan smarter — before they commit capital on-chain."
            align="center"
            className="mx-auto mb-10 max-w-xl"
          />
        </motion.div>
      </FadeIn>

      <FadeIn delay={120}>
        <div className="mx-auto flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </FadeIn>
    </section>
  );
}
