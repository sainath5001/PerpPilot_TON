"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: TestimonialsColumnProps) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {testimonials.map((item) => (
              <div
                key={`${copy}-${item.name}`}
                className="w-full max-w-xs rounded-3xl border border-border/60 bg-card/40 p-8 shadow-lg shadow-emerald-500/5 sm:p-10"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-5 tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-sm leading-5 tracking-tight text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
