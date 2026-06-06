"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "none";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInProps) {
  return (
    <div
      className={cn(
        "animate-fade-in opacity-0",
        direction === "up" && "animate-fade-in-up",
        direction === "down" && "animate-fade-in-down",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {children}
    </div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}

export function StaggerChildren({
  children,
  className,
  staggerMs = 80,
}: StaggerChildrenProps) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {items.map((child, index) => (
        <FadeIn key={index} delay={index * staggerMs}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
