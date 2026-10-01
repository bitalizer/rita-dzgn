/** Tiny class joiner — no runtime dependency needed for this design system. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
