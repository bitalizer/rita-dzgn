import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CtaMarquee } from "@/components/sections/Marquees";
import { Container } from "@/components/ui/Layout";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { withBlur } from "@/lib/blur";
import { ogBase, ogImage } from "@/lib/seo";

const title = "Projects";
const description = "Selected logo design, visual identity and website projects by Rita, graphic & web designer.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/projects/" },
  openGraph: { ...ogBase, url: "/projects/", title: `${title} — ${site.name}`, description, images: [ogImage] },
  twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description, images: [ogImage] },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <section aria-labelledby="projects-index-title" className="pt-section">
            <ProjectsGrid projects={projects.map(withBlur)} />
          </section>
        </Container>
        <CtaMarquee />
      </main>
      <Footer />
    </>
  );
}
