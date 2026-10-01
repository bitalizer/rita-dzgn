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
  priority = false,
  className,
}: {
  project: Project;
  size?: "lg" | "sm";
  priority?: boolean;
  className?: string;
}) {
  const { slug, title, category, year, cover } = project;
  return (
    <article className={cn("flex flex-col gap-[15px]", className)}>
      <TransitionLink
        href={`/projects/${slug}/`}
        label={title}
        aria-label={`${title} — ${category}`}
        data-cursor="view"
        data-cursor-label="view"
        className={cn("group relative block overflow-hidden bg-mist", size === "sm" ? "aspect-square md:aspect-[265/273]" : "aspect-square")}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes={
            size === "sm"
              ? "(min-width: 1440px) 265px, (min-width: 1024px) 19vw, (min-width: 768px) 50vw, 100vw"
              : "(min-width: 1440px) 547px, (min-width: 1024px) 41vw, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-800 ease-out-expo group-hover:scale-[1.04]"
        />
      </TransitionLink>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-[7px]">
          <h3 className="text-sub font-semibold">{title}</h3>
          <span className="text-body">({category})</span>
        </div>
        <span className="text-body whitespace-nowrap">{year}</span>
      </div>
    </article>
  );
}
