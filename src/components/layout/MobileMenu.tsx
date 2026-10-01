"use client";

import { useEffect, useState } from "react";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { contactLinks, primaryNav, secondaryNav } from "@/content/site";

const items = [...primaryNav, ...secondaryNav].map((i) => ({ ...i, label: i.label.replace(/[()]/g, "") }));

/** Full-screen black menu for < lg. Locks scroll while open, closes on Escape / link click. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
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
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-ink px-gutter py-[30px] text-paper animate-fade-up"
        >
          <div className="flex items-center justify-between">
            <span className="text-[20px] leading-[0.9] font-black">
              rita.d<em className="italic">z</em>gn
            </span>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer border-0 bg-transparent p-0 text-label">
              (close)
            </button>
          </div>
          <nav className="mt-16 flex flex-col items-start gap-[22px] text-[clamp(34px,10vw,56px)] leading-none font-extrabold">
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
          <p className="mt-auto text-label text-cream">
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
