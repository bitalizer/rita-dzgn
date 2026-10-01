import Link from "next/link";
import { CookieSettings } from "@/components/layout/CookieSettings";
import { Wordmark } from "@/components/layout/Wordmark";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Container } from "@/components/ui/Layout";
import { primaryNav, secondaryNav, site } from "@/content/site";

const link = "transition-opacity duration-200 hover:opacity-60";
/** Six links on a 3-column grid so both rows share column starts (FAQ / work steps / contact me over about me / projects / services). */
const footerNav = [...secondaryNav, ...primaryNav];

export function Footer() {
  return (
    <footer>
      <Container className="pt-12.5">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-119 text-sub leading-[1.3] font-semibold">
            {site.role} creating visual identities and digital experiences for modern brands that care about aesthetics and detail.
          </p>
          <nav
            aria-label="Footer"
            className="grid min-h-19.5 grid-cols-[repeat(3,max-content)] content-between gap-x-[clamp(1.5rem,6.667vw,6rem)] gap-y-7 text-label"
          >
            {footerNav.map((i) => (
              <AnchorLink key={i.href} href={i.href} className={link}>
                {i.label}
              </AnchorLink>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-[clamp(1.5rem,6.667vw,6rem)] gap-y-3 text-label text-paper/60">
          <Link href={site.privacyPolicyUrl} className={link}>
            (privacy policy)
          </Link>
          <CookieSettings className={link} />
        </div>
        {/* Giant pink wordmark, cropped at the page bottom (1340 × 257 visible). */}
        <Wordmark className="mt-5.25 block h-auto w-full text-pink" />
      </Container>
    </footer>
  );
}
