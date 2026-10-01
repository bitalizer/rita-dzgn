import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Layout";

/**
 * Two 660×762 cards: pink copy card · full-bleed portrait with a bottom gradient.
 * Vertical rhythm inside the pink card is fixed (45 · 20 · 48 · 48 · 35) so its
 * natural height is 762 at 1440×900. On shorter screens (13" laptops) the pink card is capped at
 * viewport − header, the collage absorbs the difference, and the portrait stretches to match —
 * so both "Explore …" buttons always sit on the first screen.
 */
export function Hero() {
  return (
    <Container>
      <section id="top" aria-labelledby="hero-title" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-stretch gap-5">
        <div className="flex flex-col items-center bg-pink px-[clamp(20px,2.431vw,35px)] pt-[clamp(28px,3.125vw,45px)] pb-[clamp(20px,2.431vw,35px)] text-center text-ink animate-fade-up lg:max-h-[max(600px,calc(100svh_-_98px))]">
          <h1 id="hero-title" className="max-w-[590px] text-display font-extrabold">
            Turning ideas into designs{" "}
            <Highlight tone="cream" animate>
              that get noticed
            </Highlight>
          </h1>
          <p className="mt-5 max-w-[485px] text-body">
            Graphic &amp; web designer specializing in logo design, visual identity and website design. I create distinctive brands and digital experiences that
            combine thoughtful visuals, clear structure and personality.
          </p>
          <div className="mt-[clamp(28px,3.333vw,48px)] flex h-[clamp(120px,14.236vw,205px)] min-h-0 shrink items-end gap-[clamp(8px,1.186vw,17.083px)]">
            <div className="relative aspect-square h-full overflow-hidden bg-mist">
              <Image src="/images/lagi.webp" alt="Lagi business cards on concrete" fill sizes="205px" className="scale-[1.264] object-cover" />
            </div>
            <div className="relative aspect-square h-[52.63%] overflow-hidden bg-mist">
              <Image src="/images/women-wellness-web.webp" alt="Women Wellness website on a laptop" fill sizes="108px" className="object-cover" />
            </div>
          </div>
          <div className="mt-auto w-full pt-[clamp(28px,3.333vw,48px)]">
            <Button href="/#projects" variant="ink" className="w-full">
              Explore the portfolio
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-[clamp(420px,60vw,600px)] flex-col justify-end overflow-hidden bg-mist p-[clamp(20px,2.431vw,35px)] animate-fade-up [animation-delay:.1s] lg:min-h-0">
          <Image
            src="/images/hero-panel.webp"
            alt="Rita — graphic and web designer"
            fill
            priority
            sizes="(min-width: 1440px) 660px, (min-width: 1024px) 46vw, 100vw"
            className="object-cover object-[50%_93.21%] animate-hero-zoom"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[clamp(120px,14.167vw,204px)] bg-linear-to-t from-ink/70 to-transparent" />
          <Button href="/#services" variant="cream" className="relative w-full">
            Explore the services
          </Button>
        </div>
      </section>
    </Container>
  );
}
