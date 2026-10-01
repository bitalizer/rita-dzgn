import type { ReactNode } from "react";
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
 * Inside a <Reveal> it draws in from left to right when the heading scrolls into view.
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
  return <span className={cn("hl", tones[tone], animate && "animate-hl-in", className)}>{children}</span>;
}
