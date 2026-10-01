"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

/**
 * `next/link` for section links like "/#contact". When the section is on the current page it always scrolls there and keeps
 * the query string (e.g. ?utm_… from an ad). Plain Link doesn't: "/#contact" vs "/?utm_…" counts as a route change, and
 * clicking the hash the URL already has counts as no change — neither scrolls. From other pages it navigates as usual.
 */
export function AnchorLink({ href, onClick, ...rest }: ComponentPropsWithoutRef<typeof Link> & { href: string }) {
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, hash] = href.split("#");
    if (!hash || (path || "/") !== location.pathname) return;
    const target = document.getElementById(hash);
    if (!target) return;
    e.preventDefault();
    // Next frame: lets the mobile menu close and release its scroll lock first.
    requestAnimationFrame(() => target.scrollIntoView());
    history.pushState(history.state, "", `${location.pathname}${location.search}#${hash}`);
  }

  return <Link href={href} onClick={handle} {...rest} />;
}
