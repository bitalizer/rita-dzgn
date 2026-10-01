"use client";

import { useEffect, useState } from "react";

/**
 * Preloader curtain: counts 000→100 (ease-out, 1.4s), then two cream halves split (CSS keyframes in globals.css).
 * Renders only on the first visit of a session so route changes never replay it. Mount once in app/layout.tsx.
 */
export function Curtain() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("curtain-seen")) return;
    sessionStorage.setItem("curtain-seen", "1");
    setShow(true);
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / 1400);
      setCount(Math.round((1 - (1 - p) ** 3) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const done = setTimeout(() => setShow(false), 2600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, []);

  if (!show) return null;
  return (
    <div data-curtain aria-hidden="true" className="pointer-events-none fixed inset-0 z-[10000] grid place-items-center">
      <span data-half="l" className="absolute inset-y-0 left-0 w-[50.5%] bg-paper" />
      <span data-half="r" className="absolute inset-y-0 right-0 w-[50.5%] bg-paper" />
      <span data-count className="relative text-[clamp(64px,12vw,180px)] font-extrabold leading-none tracking-[-0.06em] text-ink tabular-nums">
        {String(count).padStart(3, "0")}
      </span>
    </div>
  );
}
