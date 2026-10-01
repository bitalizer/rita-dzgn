"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "link" | "view" | "text" | "hide" | "down";

/**
 * Site cursor — mouse only (pointer: fine). Reads `data-cursor` / `data-cursor-label`
 * from the hovered element; plain <a>/<button> fall back to the "open" pill.
 * Modes: default dot + lagging ring · link (56px cream pill + verb) · view (96px pink disc)
 * · text (2×28 caret) · hide (magnetic buttons own the affordance) · down (dot shrinks).
 * Mount once in app/layout.tsx and add `@media (pointer:fine){body{cursor:none}}` in globals.css.
 */
export function Cursor({ ringSize = 40 }: { ringSize?: number }) {
  const ring = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("hide");
  const [label, setLabel] = useState("");
  const [tone, setTone] = useState("");

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const tr = { x: -100, y: -100 };
    let down = false;
    let hover: { mode: Mode; label: string; tone: string } = { mode: "default", label: "", tone: "" };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("[data-cursor]") as HTMLElement | null;
      // Tone comes from the nearest tagged ancestor — a button, or a light section like the cream panels — so the cursor stays visible on light surfaces.
      const tone = (t?.closest?.("[data-cursor-tone]") as HTMLElement | null)?.dataset.cursorTone || "";
      if (el) hover = { mode: (el.dataset.cursor as Mode) || "default", label: el.dataset.cursorLabel || "", tone };
      else if (t?.closest?.("input,textarea,select")) hover = { mode: "text", label: "", tone };
      else if (t?.closest?.("a,button,summary,label")) hover = { mode: "link", label: "open", tone };
      else hover = { mode: "default", label: "", tone };
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => (hover = { mode: "hide", label: "", tone: "" });
    addEventListener("mousemove", onMove, { passive: true });
    addEventListener("mousedown", onDown);
    addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    let lastMode: Mode | "" = "";
    let lastLabel = "";
    let lastTone = "";
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.35;
      pos.y += (target.y - pos.y) * 0.35;
      tr.x += (target.x - tr.x) * 0.12;
      tr.y += (target.y - tr.y) * 0.12;
      if (ring.current) ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (trail.current) trail.current.style.transform = `translate(${tr.x}px, ${tr.y}px)`;
      const m: Mode = down && hover.mode === "default" ? "down" : hover.mode;
      if (m !== lastMode) {
        lastMode = m;
        setMode(m);
      }
      if (hover.label !== lastLabel) {
        lastLabel = hover.label;
        setLabel(hover.label);
      }
      if (hover.tone !== lastTone) {
        lastTone = hover.tone;
        setTone(hover.tone);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("mousemove", onMove);
      removeEventListener("mousedown", onDown);
      removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const hideRing = mode === "link" || mode === "view";
  return (
    <>
      <div
        ref={trail}
        aria-hidden="true"
        data-trail={mode}
        data-tone={tone || undefined}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden rounded-full border border-paper/50 -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-300 [@media(pointer:fine)]:block"
        style={{ width: hideRing ? 0 : ringSize, height: hideRing ? 0 : ringSize, opacity: hideRing || mode === "text" || mode === "hide" ? 0 : 1 }}
      />
      <div
        ref={ring}
        aria-hidden="true"
        data-ring={mode}
        data-tone={tone || undefined}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 place-items-center [@media(pointer:fine)]:grid"
      >
        <span
          data-disc
          className="block rounded-full transition-[width,height,background-color,opacity,border-radius] duration-300 ease-out-expo"
          style={cursorDisc(mode)}
        />
        <span
          data-label
          className="absolute whitespace-nowrap text-label transition-[opacity,scale] duration-300"
          style={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.8 }}
        >
          {label}
        </span>
      </div>
    </>
  );
}

function cursorDisc(mode: Mode): React.CSSProperties {
  switch (mode) {
    case "link":
      return { width: 56, height: 56 };
    case "view":
      return { width: 96, height: 96, backgroundColor: "#FECCCD" };
    case "text":
      return { width: 2, height: 28, borderRadius: 1 };
    case "hide":
      return { width: 12, height: 12, opacity: 0 };
    case "down":
      return { width: 8, height: 8 };
    default:
      return { width: 12, height: 12 };
  }
}
