"use client";

import { type CSSProperties, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Label } from "@/components/ui/Typography";
import { filters, type Kind, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";

type Slot = { project: Project; size: "lg" | "sm"; col: string; align: "start" | "end" };
type Band = Slot[];

/**
 * Checkerboard bands on the home page's 7-track grid (265 · 17 · 265 · 246 · 265 · 17 · 265):
 *
 *   band A   [ · ][sm]  [   big   ]        band B   [   big   ]  [sm][ · ]
 *            [sm][ · ]  [         ]                 [         ]  [ · ][sm]
 *
 * Items fill bands in order (A: small, small, big · B: big, small, small). A band with two items
 * puts its single small card on the bottom slot so captions share a baseline; a lone item is big-left.
 */
function layoutBands(items: Project[]): Band[] {
  const bands: Band[] = [];
  for (let i = 0, b = 0; i < items.length; b++) {
    const g = items.slice(i, i + 3);
    const band: Band = [];
    const sm = (project: Project, col: string, align: Slot["align"]): Slot => ({ project, size: "sm", col, align });
    const lg = (project: Project, col: string): Slot => ({ project, size: "lg", col, align: "start" });
    if (g.length === 1) band.push(lg(g[0], "1 / 4"));
    else if (b % 2 === 0) {
      const smalls = g.slice(0, -1);
      if (smalls.length === 2) band.push(sm(smalls[0], "3 / 4", "start"), sm(smalls[1], "1 / 2", "end"));
      else band.push(sm(smalls[0], "1 / 2", "end"));
      band.push(lg(g[g.length - 1], "5 / 8"));
    } else {
      const smalls = g.slice(1);
      band.push(lg(g[0], "1 / 4"));
      if (smalls.length === 2) band.push(sm(smalls[0], "5 / 6", "start"), sm(smalls[1], "7 / 8", "end"));
      else band.push(sm(smalls[0], "7 / 8", "end"));
    }
    bands.push(band);
    i += g.length;
  }
  return bands;
}

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Kind | "all">("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.kinds.includes(filter));
  const bands = layoutBands(visible);

  return (
    <>
      <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-[30px]">
          <Label>(my work)</Label>
          <h1 id="projects-index-title" className="text-display font-extrabold">
            projects
          </h1>
        </div>
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-[10px] pb-[0.25em]">
          {filters.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "cursor-pointer border-0 px-[10px] py-[5px] text-label transition-colors duration-250",
                  active ? "bg-cream text-ink" : "bg-transparent text-paper hover:bg-paper/30",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* < md: single column in DOM order; md+: the band placement via CSS variables (tracks scale with the width). */}
      <div className="mt-[clamp(48px,6.944vw,100px)] grid grid-cols-1 gap-y-8 md:grid-cols-[265fr_17fr_265fr_246fr_265fr_17fr_265fr] md:gap-y-[clamp(40px,6.944vw,100px)]">
        {bands.flatMap((band, b) =>
          band.map((slot, i) => (
            <Reveal
              key={slot.project.slug}
              className="md:[align-self:var(--align)] md:[grid-column:var(--col)] md:[grid-row:var(--row)]"
              style={{ "--col": slot.col, "--row": String(b + 1), "--align": slot.align } as CSSProperties}
            >
              <ProjectCard project={slot.project} size={slot.size} priority={b === 0 && i < 3} />
            </Reveal>
          )),
        )}
      </div>
    </>
  );
}
