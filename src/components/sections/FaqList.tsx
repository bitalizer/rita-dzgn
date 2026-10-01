"use client";

import { useId, useState } from "react";
import { Plus } from "@/components/ui/Icons";
import type { Faq } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Accordion. One item open at a time (first by default). Height animates via grid-template-rows,
 * the "+" rotates into a "×". Fully keyboard/screen-reader friendly (button + aria-controls).
 */
export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number>(0);
  const id = useId();

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${id}-panel-${i}`;
        return (
          <div key={item.q} className="border-b border-ink/30 pb-5">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full cursor-pointer items-center gap-6.5 border-0 bg-transparent p-0 text-left text-ink"
              >
                <span className="flex-1 text-sub leading-none font-semibold">{item.q}</span>
                <span className="flex size-10.5 flex-none items-center justify-center">
                  <Plus className={cn("transition-transform duration-450 ease-out-expo", isOpen && "rotate-45")} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={cn("grid transition-[grid-template-rows] duration-450 ease-out-expo", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-150 pt-4 pr-17 pb-1 text-body">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
