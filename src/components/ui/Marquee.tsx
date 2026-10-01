import { Star } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

/**
 * Infinite running band (80px ExtraBold, ✱ separators). The track holds the word list twice and
 * translates by exactly 50%, so the loop is seamless at any width. Decorative → aria-hidden.
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
  return (
    <div aria-hidden="true" className={cn("flex overflow-hidden py-[clamp(14px,2.083vw,30px)] text-ink", tone === "pink" ? "bg-pink" : "bg-cream", className)}>
      <div
        className={cn("flex flex-none will-change-transform", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-[clamp(24px,3.472vw,50px)] pr-[clamp(24px,3.472vw,50px)] whitespace-nowrap text-display font-extrabold"
          >
            {word}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
