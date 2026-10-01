"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

export const CURTAIN_EVENT = "curtain:in";
/** How long the curtain takes to cover the page before the route switches underneath it. */
export const CURTAIN_MS = 600;

/**
 * `next/link` that plays the page-transition curtain first. Falls back to a plain navigation for
 * hash links, modified clicks (new tab), external URLs and users who prefer reduced motion.
 */
export function TransitionLink({ href, label, onClick, children, ...rest }: ComponentPropsWithoutRef<typeof Link> & { label?: string }) {
  const router = useRouter();

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const to = typeof href === "string" ? href : (href.pathname ?? "");
    if (!to.startsWith("/") || to.includes("#")) return;
    if (document.documentElement.dataset.motion === "off") return;
    e.preventDefault();
    const text = label ?? (e.currentTarget.textContent ?? "").replace(/[()→←]/g, "").trim();
    window.dispatchEvent(new CustomEvent(CURTAIN_EVENT, { detail: { label: text } }));
    router.prefetch(to);
    window.setTimeout(() => router.push(to), CURTAIN_MS);
  }

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
