import { cn } from "@/lib/cn";

/** The 8-point asterisk between marquee words (32.585×32.727). */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32.585 32.727" aria-hidden="true" className={cn("h-auto w-[clamp(16px,2.263vw,32.585px)] flex-none fill-current", className)}>
      <path d="M12.102 32.727 12.926 22.216 4.176 28.21 0 20.881 9.489 16.364 0 11.847 4.176 4.517 12.926 10.511 12.102 0h8.381l-.824 10.511 8.75-5.994 4.176 7.33-9.488 4.517 9.488 4.517-4.176 7.329-8.75-5.994.824 10.511z" />
    </svg>
  );
}

/** "+" that becomes "×" when rotated 45° (FAQ). */
export function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20.429 20.413" aria-hidden="true" className={cn("h-[20.413px] w-[20.429px] fill-current", className)}>
      <path d="M8.836 20.413V0h2.757v20.413H8.836ZM0 11.577V8.836h20.429v2.741H0Z" />
    </svg>
  );
}

/** Select caret (10×5 triangle). */
export function Caret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 5" aria-hidden="true" className={cn("h-[5px] w-[10px] fill-[#FDFDFD]", className)}>
      <path d="M5 5 10 0H0Z" />
    </svg>
  );
}
