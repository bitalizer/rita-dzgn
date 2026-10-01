"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type HighlightTone = "cream" | "pink" | "glass";

/** Bar color per surface: cream on pink, pink on cream, 30% white on black. */
const tones: Record<HighlightTone, string> = {
  cream: "[--hl:var(--color-cream)]",
  pink: "[--hl:var(--color-pink)]",
  glass: "[--hl:rgba(255,255,255,0.3)]",
};

/**
 * Marker-style highlight behind a phrase inside a display heading.
 * It draws in from left to right once the phrase itself is fully on screen (clear of the bottom 15%), so a long heading
 * entering the viewport doesn't finish the effect before the highlighted words are visible.
 * `animate` runs the draw-in immediately (used above the fold, in the hero).
 */
export function Highlight({
  tone = "cream",
  animate = false,
  className,
  children,
}: {
  tone?: HighlightTone;
  animate?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (animate || !el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.hl = "in";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.hl = "in";
          io.disconnect();
        }
      },
      { threshold: 1, rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  return (
    <span ref={ref} data-hl={animate ? undefined : ""} className={cn("hl", tones[tone], animate && "animate-hl-in", className)}>
      {children}
    </span>
  );
}
