"use client";

import { type ComponentPropsWithoutRef, createElement, type ReactNode, useEffect, useRef } from "react";

type Tags = "div" | "section" | "article" | "h2" | "form" | "footer";

/**
 * Scroll reveal: fades/slides children in once when they enter the viewport.
 * Pure CSS on the other side (globals.css → [data-reveal]); this only flips the attribute.
 * Without JS the content is simply visible (see html[data-js] gating in globals.css).
 */
export function Reveal<T extends Tags = "div">({
  as,
  children,
  ...rest
}: { as?: T; children: ReactNode } & Omit<ComponentPropsWithoutRef<T>, "as" | "children">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.reveal = "in";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const props = { ...rest, ref, "data-reveal": "" } as Record<string, unknown>;
  return createElement(as ?? "div", props, children);
}

// Reveal forwards any data-* attribute (e.g. data-hover-zoom) to the rendered element via ...rest.
