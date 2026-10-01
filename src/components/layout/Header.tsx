import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Container } from "@/components/ui/Layout";
import { primaryNav, secondaryNav } from "@/content/site";
import { cn } from "@/lib/cn";

const link = "transition-opacity duration-200 hover:opacity-60";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="rita.dzgn — home" className={cn("text-[20px] leading-[0.9] font-black", className)}>
      rita.d<em className="italic">z</em>gn
    </Link>
  );
}

/**
 * 78px header: three links · centered wordmark · three links. Below lg the link clusters
 * collapse into a "(menu)" button that opens the full-screen menu.
 */
export function Header() {
  return (
    <header className="relative z-10">
      <Container className="grid h-[78px] grid-cols-[1fr_auto_1fr] items-center py-[30px]">
        <nav aria-label="Primary" className="hidden justify-self-start gap-[clamp(24px,6.667vw,96px)] text-label lg:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Logo className="col-start-2" />
        <nav aria-label="Secondary" className="hidden col-start-3 justify-self-end gap-[clamp(24px,6.667vw,96px)] text-label lg:flex">
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={link}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 justify-self-end lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
