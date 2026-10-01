import Image from "next/image";
import { TransitionLink } from "@/components/motion/TransitionLink";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * Cover + caption row (title / (category) · year). Two sizes:
 *  lg  547×547 image  ·  sm  265×273 image. Below lg every card is square so rows align.
 */
export function ProjectCard({
  project,
  size = "lg",
  priority,
  sizes,
  heading: Title = "h3",
  className,
}: {
  project: Project;
  size?: "lg" | "sm";
  /** For cards on screen at load: "eager" skips lazy-loading, "high" also marks the image as the page's most important one. */
  priority?: "eager" | "high";
  /** The image's width per breakpoint, where it differs from the home grid's (two columns from md, the bands from lg). */
  sizes?: string;
  /** Level of the title: h3 under a section heading (home, 404), h2 where the cards sit directly under the page title (/projects). Looks the same either way. */
  heading?: "h2" | "h3";
  className?: string;
}) {
  const { slug, title, category, year, cover } = project;
  return (
    <article className={cn("flex flex-col gap-3.75", className)}>
      <TransitionLink
        href={`/projects/${slug}/`}
        label={title}
        aria-label={`${title} — ${category}`}
        data-cursor="view"
        data-cursor-label="view"
        className={cn("group relative block overflow-hidden bg-mist", size === "sm" ? "aspect-square md:aspect-265/273" : "aspect-square")}
      >
        <Image
          src={cover.src}
          placeholder={cover.blurDataURL ? "blur" : "empty"}
          blurDataURL={cover.blurDataURL}
          alt={cover.alt}
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority === "high" ? "high" : undefined}
          sizes={
            sizes ??
            (size === "sm"
              ? "(min-width: 1440px) 18.4vw, (min-width: 1024px) 19vw, (min-width: 768px) 50vw, calc(100vw - 2.5rem)"
              : "(min-width: 1440px) 37.99vw, (min-width: 1024px) 41vw, (min-width: 768px) 50vw, calc(100vw - 2.5rem)")
          }
          className="object-cover transition-transform duration-800 ease-out-expo group-hover:scale-[1.04]"
        />
      </TransitionLink>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.75">
          <Title className="text-sub font-semibold">{title}</Title>
          <span className="text-body">({category})</span>
        </div>
        <span className="text-body whitespace-nowrap">{year}</span>
      </div>
    </article>
  );
}
