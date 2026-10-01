import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Container } from "@/components/ui/Layout";
import { primaryNav, secondaryNav } from "@/content/site";
import { cn } from "@/lib/cn";

const link = "transition-opacity duration-200 hover:opacity-60";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="rita.dzgn — home" className={cn("text-[1.25rem] leading-[0.9] font-black", className)}>
      rita.d<em className="italic">z</em>gn
    </Link>
  );
}

/**
 * 78px sticky header: three links · centered wordmark · three links. Below lg the link clusters
 * collapse into a "(menu)" button that opens the full-screen menu. Scroll behavior lives in StickyHeader.
 */
export function Header() {
  return (
    <StickyHeader>
      <Container className="grid h-19.5 grid-cols-[1fr_auto_1fr] items-center py-7.5">
        <nav aria-label="Primary" className="hidden justify-self-start gap-[clamp(1.5rem,6.667vw,6rem)] text-label lg:flex">
          {primaryNav.map((item) => (
            <AnchorLink key={item.href} href={item.href} className={link}>
              {item.label}
            </AnchorLink>
          ))}
        </nav>
        <Logo className="col-start-2" />
        <nav aria-label="Secondary" className="hidden col-start-3 justify-self-end gap-[clamp(1.5rem,6.667vw,6rem)] text-label lg:flex">
          {secondaryNav.map((item) => (
            <AnchorLink key={item.href} href={item.href} className={link}>
              {item.label}
            </AnchorLink>
          ))}
        </nav>
        <div className="col-start-3 justify-self-end lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </StickyHeader>
  );
}
