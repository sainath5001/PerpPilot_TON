"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/ui/section-header";

interface EcosystemLogo {
  name: string;
  logo: string;
  symbol: string;
}

const ECOSYSTEM_LOGOS: EcosystemLogo[] = [
  {
    name: "TON",
    logo: "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=029",
    symbol: "TON",
  },
  {
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029",
    symbol: "BTC",
  },
  {
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029",
    symbol: "ETH",
  },
  {
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029",
    symbol: "SOL",
  },
  {
    name: "Tether",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029",
    symbol: "USDT",
  },
  {
    name: "STON.fi",
    logo: "https://ston.fi/favicon-32x32.png",
    symbol: "STON",
  },
  {
    name: "Arbitrum",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=029",
    symbol: "ARB",
  },
  {
    name: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=029",
    symbol: "MATIC",
  },
];

function EcosystemLogoCard({ name, logo, symbol }: EcosystemLogo) {
  return (
    <div className="mx-8 flex flex-col items-center justify-center gap-2 sm:mx-10">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/60 bg-card/40 p-3 transition-transform duration-300 hover:scale-105 sm:h-24 sm:w-24">
        <Image
          src={logo}
          alt={name}
          width={64}
          height={64}
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          unoptimized
        />
      </div>
      <span className="font-mono text-xs font-semibold text-muted-foreground">
        {symbol}
      </span>
    </div>
  );
}

export function EcosystemMarqueeSection() {
  return (
    <section id="ecosystem" className="mt-28 lg:mt-36">
      <FadeIn>
        <SectionHeader
          badge="Ecosystem"
          title="Markets & liquidity across the TON stack"
          description="PerpPilot charts and collateral tooling align with assets and protocols traders use every day."
          align="center"
          className="mb-10"
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/20 py-10">
          <Marquee duration={30} pauseOnHover direction="left" fadeAmount={8}>
            {ECOSYSTEM_LOGOS.map((crypto) => (
              <EcosystemLogoCard key={crypto.symbol} {...crypto} />
            ))}
          </Marquee>
        </div>
      </FadeIn>
    </section>
  );
}
