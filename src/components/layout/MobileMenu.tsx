"use client";

import { useEffect, useRef, useState } from "react";
import { WordmarkInline } from "@/components/layout/Wordmark";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { contactLinks, primaryNav, secondaryNav } from "@/content/site";

const items = [...primaryNav, ...secondaryNav].map((i) => ({ ...i, label: i.label.replace(/[()]/g, "") }));

/**
 * Full-screen black menu for < lg. Closes on Escape / link click.
 *
 * While it is open the page underneath can't be scrolled (the menu scrolls itself if it is taller than the screen, e.g.
 * a phone in landscape, and `overscroll-contain` keeps a swipe from passing through to the page) and keyboard focus
 * lives inside it: it starts on "(close)", Tab cycles through the menu only, and closing from the keyboard hands focus
 * back to "(menu)".
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }
      if (e.key !== "Tab") return;
      const stops = dialog.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!stops?.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      // Past either end, or somehow outside the menu: wrap around instead of walking into the covered page.
      const next = !dialog.current?.contains(active) ? first : e.shiftKey && active === first ? last : !e.shiftKey && active === last ? first : null;
      if (!next) return;
      e.preventDefault();
      next.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="cursor-pointer border-0 bg-transparent p-0 text-label text-paper"
      >
        (menu)
      </button>
      {open && (
        <div
          ref={dialog}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-ink px-gutter py-7.5 text-paper animate-fade-up"
        >
          <div className="flex items-center justify-between">
            <WordmarkInline label="rita.dzgn" />
            <button
              ref={closeButton}
              type="button"
              onClick={(e) => {
                setOpen(false);
                // detail 0 = pressed with Enter/Space: the keyboard user continues from "(menu)". A tap or click leaves
                // focus alone — focus resting in the header would stop it from hiding on scroll (see StickyHeader).
                if (e.detail === 0) trigger.current?.focus({ preventScroll: true });
              }}
              className="cursor-pointer border-0 bg-transparent p-0 text-label"
            >
              (close)
            </button>
          </div>
          <nav className="mt-16 flex flex-none flex-col items-start gap-5.5 text-[clamp(2.125rem,10vw,3.5rem)] leading-none font-extrabold">
            {items.map((item) => (
              <AnchorLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-block pr-[0.2em] transition-[color,translate] duration-400 ease-out-expo hover:translate-x-[0.15em] hover:text-pink"
              >
                {item.label}
              </AnchorLink>
            ))}
          </nav>
          <p className="mt-auto flex-none pt-10 text-label text-cream">
            {contactLinks.map((l, i) => (
              <span key={l.href}>
                {i > 0 && " // "}
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      )}
    </>
  );
}
