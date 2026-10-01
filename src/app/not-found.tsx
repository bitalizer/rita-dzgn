import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CtaMarquee } from "@/components/sections/Marquees";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Typography";
import { getProject } from "@/content/projects";
import { withBlur } from "@/lib/blur";

export const metadata: Metadata = { title: "Page not found", robots: { index: false }, alternates: { canonical: null } };

/** Recovery paths: the work a lost visitor most likely came for. */
const suggestions = ["women-wellness-identity", "women-wellness-website", "lagi"];

/**
 * 404: a centered first-screen composition (oversized pink "404", the headline, two ways back), then three project
 * cards so the visitor is one click from the work instead of at a dead end.
 */
export default function NotFound() {
  const projects = suggestions.flatMap((slug) => {
    const p = getProject(slug);
    return p ? [withBlur(p)] : [];
  });

  return (
    <>
      <Header />
      <main>
        <Container>
          <section
            aria-labelledby="not-found-title"
            className="flex min-h-[calc(100svh-4.875rem)] animate-fade-up flex-col items-center justify-center py-[clamp(2rem,6svh,4rem)] text-center"
          >
            {/* Sized by width and height so the whole stack fits the first screen; pr offsets the trailing letter-spacing so the digits sit truly centered. */}
            <p aria-hidden="true" className="pr-[0.05em] text-[clamp(7rem,min(22vw,34svh),20rem)] leading-[0.8] font-extrabold text-pink">
              404
            </p>
            <h1 id="not-found-title" className="mt-[clamp(1.75rem,3.125vw,2.8125rem)] text-display font-extrabold">
              This page doesn’t exist. <br className="max-sm:hidden" />
              <Highlight tone="glass" animate>
                The work does.
              </Highlight>
            </h1>
            <div className="mt-[clamp(2.5rem,4.583vw,4.125rem)] flex w-full flex-col gap-5 sm:w-auto sm:flex-row">
              <Button href="/" variant="pink" className="sm:w-50.5">
                Back home
              </Button>
              <Button href="/projects/" variant="cream" className="sm:w-50.5">
                View projects
              </Button>
            </div>
          </section>

          <section aria-labelledby="not-found-work">
            <Reveal>
              <SectionHeading label="(while you’re here)" title={<span id="not-found-work">selected work</span>} />
            </Reveal>
            <div className="mt-[clamp(2.5rem,4.861vw,4.375rem)] grid grid-cols-1 gap-5 md:grid-cols-3">
              {projects.map((project) => (
                <Reveal key={project.slug}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </section>
        </Container>
        <CtaMarquee />
      </main>
      <Footer />
    </>
  );
}
