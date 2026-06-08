"use client";

import {
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  Children,
} from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  duration?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  fade?: boolean;
  fadeAmount?: number;
}

export function Marquee({
  children,
  className,
  duration = 20,
  pauseOnHover = false,
  direction = "left",
  fade = true,
  fadeAmount = 10,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const items = Children.toArray(children);

  return (
    <>
      <style>
        {`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-scroller {
          display: flex;
          animation: ${direction === "left" ? "marquee-scroll" : "marquee-scroll-reverse"} ${duration}s linear infinite;
        }
        .marquee-scroller.paused {
          animation-play-state: paused;
        }
      `}
      </style>
      <div
        ref={containerRef}
        className={cn("flex w-full overflow-hidden", className)}
        style={{
          ...(fade && {
            maskImage: `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${fadeAmount}%, black ${100 - fadeAmount}%, transparent 100%)`,
          }),
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        {...props}
      >
        <div
          className={cn("marquee-scroller flex shrink-0", isPaused && "paused")}
        >
          {items.map((item, index) => (
            <div key={`first-${index}`} className="flex shrink-0">
              {item}
            </div>
          ))}
          {items.map((item, index) => (
            <div key={`second-${index}`} className="flex shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
