import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Typography";
import { getProject } from "@/content/projects";
import { withBlur } from "@/lib/blur";

/**
 * Staggered grid on a 7-track template (265 · 17 · 265 · 246 · 265 · 17 · 265):
 *
 *   [ title       ] [ Women Wellness (lg) ]
 *   [ Heliosync sm] [                     ]
 *   [ WW web  (lg)] [ Lagi sm ]  [Pihaspa sm ↓ bottom-aligned ]
 *
 * Below lg it degrades to a plain 2-column (md) / 1-column grid in DOM order.
 */
const placements: Array<{ slug: string; size: "lg" | "sm"; className: string }> = [
  { slug: "women-wellness-identity", size: "lg", className: "lg:col-start-5 lg:col-end-8 lg:row-start-1 lg:row-end-3" },
  { slug: "heliosync", size: "sm", className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:self-end" },
  { slug: "women-wellness-website", size: "lg", className: "lg:col-start-1 lg:col-end-4 lg:row-start-3" },
  { slug: "lagi", size: "sm", className: "lg:col-start-5 lg:col-end-6 lg:row-start-3 lg:self-start" },
  { slug: "pihaspa", size: "sm", className: "lg:col-start-7 lg:col-end-8 lg:row-start-3 lg:self-end" },
];

export function Projects() {
  return (
    <Container>
      <section id="projects" aria-labelledby="projects-title" className="pt-section">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-5 lg:grid-cols-[265fr_17fr_265fr_246fr_265fr_17fr_265fr] lg:gap-x-0 lg:gap-y-[clamp(2.5rem,6.944vw,6.25rem)]">
          <Reveal className="md:col-span-2 lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:self-start">
            <SectionHeading label="(my work)" title={<span id="projects-title">projects</span>} />
          </Reveal>
          {placements.map(({ slug, size, className }) => {
            const project = getProject(slug);
            if (!project) return null;
            return (
              <Reveal key={slug} className={className}>
                <ProjectCard project={withBlur(project)} size={size} />
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-[clamp(2.5rem,5.556vw,5rem)]">
          <Button href="/projects/" variant="pink" className="w-full">
            View all projects
          </Button>
        </Reveal>
      </section>
    </Container>
  );
}
