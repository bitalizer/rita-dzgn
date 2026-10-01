"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Sticky header shell. Sets two attributes the styles react to:
 *  data-scrolled — page is past the top: the frosted background fades in
 *  data-hidden   — scrolling down: the header slides away; any upward scroll brings it back. On desktop it only starts
 *                  once the first screen (where the hero ends) is passed; on phones after the first ~160px
 * With reduced motion it never hides. Slides via `top` and keeps the blur on a separate layer, because a transform or
 * backdrop-filter on <header> would trap the fixed full-screen mobile menu inside it.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canHide = document.documentElement.dataset.motion === "on";
    let last = scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = scrollY;
      el.toggleAttribute("data-scrolled", y > 8);
      const hideAfter = matchMedia("(width >= 64rem)").matches ? innerHeight : 160;
      if (!canHide || y < hideAfter) el.removeAttribute("data-hidden");
      else if (y > last + 4) el.setAttribute("data-hidden", "");
      else if (y < last - 4) el.removeAttribute("data-hidden");
      if (Math.abs(y - last) > 4) last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} className="group sticky top-0 z-40 transition-[top] duration-500 ease-out-expo data-hidden:not-focus-within:-top-19.5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 border-b-[0.5px] border-paper/10 bg-ink/70 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-data-scrolled:opacity-100"
      />
      {children}
    </header>
  );
}
