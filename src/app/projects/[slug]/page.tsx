import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Contact } from "@/components/sections/Contact";
import { CtaMarquee } from "@/components/sections/Marquees";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { type GalleryRow, galleryRows, getProject, projects } from "@/content/projects";
import { blur } from "@/lib/blur";
import { cn } from "@/lib/cn";
import { projectSchema } from "@/lib/schema";
import { ogBase } from "@/lib/seo";

type Params = { slug: string };

/** Static export: every case study is pre-rendered. */
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} ${p.category}`;
  // 1200×630 preview generated from the cover by scripts/icons.mjs.
  const image = { url: `/og/${p.slug}.jpg`, width: 1200, height: 630, alt: p.cover.alt, type: "image/jpeg" };
  return {
    title,
    description: p.intro,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: { ...ogBase, type: "article", url: `/projects/${p.slug}/`, title, description: p.intro, images: [image] },
    twitter: { card: "summary_large_image", title, description: p.intro, images: [image] },
  };
}

const CTA_WORDS = ["logo design", "visual identity", "website design", "let’s work together", "let’s work together"];

/** Heading split into words so each rises out of the mask with its own delay (one 80px heading, title + category). */
function RisingHeading({ text }: { text: string }) {
  return (
    <h1 aria-label={text} className="text-display font-extrabold mr-[-0.22em]">
      {text.split(" ").map((word, i) => (
        <span key={i} data-word aria-hidden="true" style={{ animationDelay: `${(0.5 + i * 0.07).toFixed(2)}s` }}>
          {word}
        </span>
      ))}
    </h1>
  );
}

const tileAspect = (kind: GalleryRow["kind"]) => (kind === "pair" ? "aspect-[660.15/742.669]" : "aspect-1340/753.75");
const rowGrid = (kind: GalleryRow["kind"]) => cn("grid gap-5", kind === "pair" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1");
const imgSizes = (kind: GalleryRow["kind"]) =>
  kind === "pair" ? "(min-width: 1440px) 45.83vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1440px) 93.06vw, 100vw";

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const [firstRow, ...rows] = galleryRows(project.gallery);

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema(project)) }} />
        {/* Reading progress — scroll-driven, only where supported. */}
        <div data-progress aria-hidden="true" className="fixed top-0 left-0 z-40 hidden h-[3px] w-full origin-left bg-pink" />
        <Container>
          <article className="pt-[clamp(3rem,5vw,4.5rem)]">
            {/* Label column 227 · heading column 1113 (no wrap under the label). */}
            <header className="flex flex-col gap-6 lg:grid lg:grid-cols-[227fr_1113fr] lg:items-start">
              <TransitionLink
                href="/projects/"
                label="projects"
                data-back
                data-enter="0"
                data-cursor="link"
                data-cursor-label="back"
                className="justify-self-start pt-[0.1em] text-label transition-opacity duration-200 hover:opacity-60"
              >
                (back to projects)
              </TransitionLink>
              <div className="overflow-hidden text-display pb-[0.15em] mb-[-0.15em]">
                <RisingHeading text={`${project.title} ${project.category}`} />
              </div>
            </header>

            {/* year · services (two 320 columns with hairlines) + the 433px intro, bottom-aligned. */}
            <div data-enter="3" className="mt-8 flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <dl className="m-0 flex w-full max-w-170 gap-10">
                {[
                  { label: "industry", value: project.industry, delay: 0.85 },
                  { label: "services", value: project.services.join(", "), delay: 0.95 },
                ].map((m) => (
                  <div key={m.label} className="flex min-w-0 flex-1 flex-col gap-1.75">
                    <dt className="text-body">{m.label}</dt>
                    <span data-line aria-hidden="true" className="block h-[0.5px] origin-left bg-paper/30" style={{ animationDelay: `${m.delay}s` }} />
                    <dd className="m-0 text-sub font-semibold">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <p data-cursor="text" className="w-full text-body lg:w-108.25 lg:flex-none">
                {project.intro}
              </p>
            </div>

            {/* First row: tiles unveil top-to-bottom while the photo settles from a zoom, then drift with scroll. */}
            {firstRow && (
              <div className={cn("mt-[clamp(3rem,7.083vw,6.375rem)]", rowGrid(firstRow.kind))}>
                {firstRow.items.map((t, i) => (
                  <div
                    key={t.src}
                    data-parallax
                    data-enter="unveil"
                    className={cn("relative overflow-hidden bg-[#1c1c1c]", tileAspect(firstRow.kind))}
                    style={{ animationDelay: `${(0.5 + i * 0.15).toFixed(2)}s` }}
                  >
                    <div className="absolute inset-0">
                      <Image src={t.src} {...blur(t.src)} alt={t.alt} fill preload sizes={imgSizes(firstRow.kind)} className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {project.about.length > 0 && (
              <section aria-labelledby="about-project" className="mt-[clamp(3rem,7.083vw,6.375rem)]">
                <Reveal as="h2" id="about-project" className="text-display font-extrabold">
                  About the project
                </Reveal>
                <div className="mt-7 flex justify-end">
                  <Reveal data-steps data-cursor="text" className="flex w-full flex-col gap-[1.3em] text-body lg:w-108.25">
                    {project.about.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </Reveal>
                </div>
              </section>
            )}

            <div className="mt-[clamp(3rem,7.083vw,6.375rem)] flex flex-col gap-5">
              {rows.map((row, r) => (
                <Reveal key={r} className={rowGrid(row.kind)}>
                  {row.items.map((t, i) => (
                    <div
                      key={t.src}
                      data-hover-zoom
                      data-cursor="view"
                      data-cursor-label="view"
                      className={cn("relative overflow-hidden bg-[#1c1c1c]", tileAspect(row.kind))}
                    >
                      <div data-zoom className="absolute inset-0" style={i === 1 ? { transitionDelay: "0.15s" } : undefined}>
                        <Image src={t.src} {...blur(t.src)} alt={t.alt} fill sizes={imgSizes(row.kind)} className="object-cover" />
                      </div>
                    </div>
                  ))}
                </Reveal>
              ))}
            </div>
          </article>
        </Container>
        <Contact />
        <CtaMarquee words={CTA_WORDS} />
      </main>
      <Footer />
    </>
  );
}
