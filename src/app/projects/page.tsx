import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CtaMarquee } from "@/components/sections/Marquees";
import { Container } from "@/components/ui/Layout";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected logo design, visual identity and website projects.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <section aria-labelledby="projects-index-title" className="pt-section">
            <ProjectsGrid projects={projects} />
          </section>
        </Container>
        <CtaMarquee />
      </main>
      <Footer />
    </>
  );
}
