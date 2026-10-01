import type Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { cn } from "@/lib/cn";

export type ButtonVariant = "ink" | "cream" | "pink";

const base =
  "inline-flex items-center justify-center px-[10px] py-5 text-sub font-bold transition-colors duration-250 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink";

/** Flat rectangles; hover swaps to the neighbouring surface color. Over buttons the custom cursor inverts to ink (data-cursor-tone="ink") so it stays readable on the light hover surface. */
const variants: Record<ButtonVariant, string> = {
  ink: "bg-ink text-paper hover:bg-cream hover:text-ink",
  cream: "bg-cream text-ink hover:bg-pink",
  pink: "bg-pink text-ink hover:bg-cream",
};

type Common = { variant?: ButtonVariant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function Button(props: AsLink | AsButton) {
  const { variant = "ink", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    // Route changes play the curtain transition; section links ("/#contact") scroll within the page.
    const Tag = href.includes("#") ? AnchorLink : TransitionLink;
    return (
      <Tag href={href} className={classes} data-cursor="link" data-cursor-label="open" data-cursor-tone="ink" {...rest}>
        {children}
      </Tag>
    );
  }
  const { variant: _v, className: _c, children: _ch, href: _h, type, ...rest } = props;
  return (
    <button
      type={type ?? "button"}
      className={cn(classes, "cursor-pointer border-0")}
      data-cursor="link"
      data-cursor-label="open"
      data-cursor-tone="ink"
      {...rest}
    >
      {children}
    </button>
  );
}
