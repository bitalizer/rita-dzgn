import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The bracketed 16px labels — "(about me)", "(my work)", … */
export function Label({
  className,
  children,
  as: Tag = "span",
  ...rest
}: { as?: "span" | "p"; className?: string; children: ReactNode } & ComponentPropsWithoutRef<"span">) {
  return (
    <Tag className={cn("block text-label", className)} {...rest}>
      {children}
    </Tag>
  );
}

type HeadingTag = "h1" | "h2" | "h3";

/**
 * 80px Inter ExtraBold display heading.
 * `label` reproduces the pattern where the bracketed label sits on the first line and the
 * heading text starts 227px in (16.94% of the 1340 content width), then wraps under the label.
 */
export function Display({
  as: Tag = "h2",
  label,
  labelWidth = "w-[max(7.5rem,16.94%)]",
  className,
  children,
  ...rest
}: {
  as?: HeadingTag;
  label?: string;
  labelWidth?: string;
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"h2">) {
  return (
    <Tag className={cn("text-display font-extrabold", className)} {...rest}>
      {label && <span className={cn("float-left text-label font-normal", labelWidth)}>{label}</span>}
      {children}
    </Tag>
  );
}

/** Label + display heading stacked with a 30px gap. */
export function SectionHeading({
  label,
  title,
  align = "start",
  as = "h2",
  className,
}: {
  label: string;
  title: ReactNode;
  align?: "start" | "center";
  as?: HeadingTag;
  className?: string;
}) {
  const Tag: ElementType = as;
  return (
    <div className={cn("flex flex-col gap-[1.875rem]", align === "center" && "items-center text-center", className)}>
      <Label>{label}</Label>
      <Tag className="text-display font-extrabold">{title}</Tag>
    </div>
  );
}
