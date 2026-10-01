import { cn } from "@/lib/cn";

/**
 * The "rita.dzgn" wordmark (1302 × 321 artwork, baseline at y = 251), drawn from the outlines that <WordmarkSprite />
 * defines once per page. Color follows the text color.
 * `cropped` cuts the artwork at the baseline so the descender of the "g" is lost — the footer's giant wordmark runs off
 * the bottom of the page this way. Pass `label` where the wordmark is content; without it the SVG is decorative.
 */
export function Wordmark({ cropped = false, label, className }: { cropped?: boolean; label?: string; className?: string }) {
  return (
    <svg
      viewBox={`0 0 1302 ${cropped ? 251 : 321}`}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <use href="#wordmark" />
    </svg>
  );
}

/**
 * The wordmark at header size: 20px from the dot of the "i" to the foot of the "g", the size the 20px Inter Black text
 * it replaces was drawn at. It sits on the same 18px line that text occupied, so nothing around it moves.
 */
export function WordmarkInline({ label, className }: { label?: string; className?: string }) {
  return (
    <span className={cn("flex h-4.5 items-start", className)}>
      <Wordmark label={label} className="mt-[0.03125rem] h-5 w-auto" />
    </span>
  );
}
