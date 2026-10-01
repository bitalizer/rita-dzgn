"use client";

import { useEffect, useRef } from "react";
import { Star } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * Infinite running band (80px ExtraBold, ✱ separators). The track holds the word list twice and
 * translates by exactly 50%, so the loop is seamless at any width. Decorative → aria-hidden.
 * Paused while off-screen so the bands don't keep the GPU busy when nobody can see them.
 */
export function Marquee({
  words,
  tone = "pink",
  reverse = false,
  duration = 42,
  className,
}: {
  words: string[];
  tone?: "pink" | "cream";
  reverse?: boolean;
  /** Seconds per loop. */
  duration?: number;
  className?: string;
}) {
  const items = [...words, ...words];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-offscreen", !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-cursor-tone="ink"
      className={cn("group flex overflow-hidden py-[clamp(0.875rem,2.083vw,1.875rem)] text-ink", tone === "pink" ? "bg-pink" : "bg-cream", className)}
    >
      <div
        className={cn(
          "flex flex-none will-change-transform group-data-offscreen:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-[clamp(1.5rem,3.472vw,3.125rem)] pr-[clamp(1.5rem,3.472vw,3.125rem)] whitespace-nowrap text-display font-extrabold"
          >
            {word}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
