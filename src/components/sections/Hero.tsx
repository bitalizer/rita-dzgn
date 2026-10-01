import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Layout";
import { blur } from "@/lib/blur";

/**
 * Two 660×762 cards: pink copy card · full-bleed portrait with a bottom gradient.
 * On desktop both cards fill the first screen (viewport − header), never shorter than 600px and never taller than
 * 60vw so tall or vertical monitors don't get portrait strips. The image collage absorbs the difference — shrinking on
 * short laptops, growing up to ~35% on tall screens — so both "Explore …" buttons always sit on the first screen.
 *
 * Everything here is on the first screen, so nothing is lazy-loaded and the cards slide in without a fade (see `settle`
 * in globals.css). The portrait is the largest paint on desktop and on phones tall enough to show its top (otherwise the
 * headline is), so it gets the high fetch priority.
 */
export function Hero() {
  return (
    <Container>
      <section id="top" aria-labelledby="hero-title" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,26.25rem),1fr))] items-stretch gap-5">
        <div
          data-cursor-tone="ink"
          className="flex flex-col items-center bg-pink px-[clamp(1.25rem,2.431vw,2.1875rem)] pt-[clamp(1.75rem,3.125vw,2.8125rem)] pb-[clamp(1.25rem,2.431vw,2.1875rem)] text-center text-ink animate-settle lg:h-[clamp(37.5rem,calc(100svh-6.125rem),60vw)]"
        >
          <h1 id="hero-title" className="max-w-147.5 text-display font-extrabold">
            Turning ideas into designs{" "}
            <Highlight tone="cream" animate>
              that get noticed
            </Highlight>
          </h1>
          <p className="mt-5 max-w-121.25 text-body">
            Graphic &amp; web designer specializing in logo design, visual identity and website design. I create distinctive brands and digital experiences that
            combine thoughtful visuals, clear structure and personality.
          </p>
          {/* --collage is the row's size. The flex-basis is what sizes the row (it grows and shrinks with the card); the
              height is for Safari up to 26.2, which only turns the tiles' height into a square's width when the row has
              a real `height`. Without it the tiles are 0px wide wherever the card has no fixed height: every phone and tablet. */}
          <div className="mt-[clamp(1.75rem,3.333vw,3rem)] flex h-(--collage) min-h-0 shrink grow basis-(--collage) max-h-[clamp(10rem,19.2vw,17.3rem)] items-end gap-[clamp(0.5rem,1.186vw,1.0677rem)] [--collage:clamp(7.5rem,14.236vw,12.8125rem)]">
            <div className="relative aspect-square h-full overflow-hidden bg-mist">
              <Image
                src="/images/lagi.webp"
                {...blur("/images/lagi.webp")}
                alt="Lagi business cards on concrete"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 350px, (min-width: 900px) 185px, 152px"
                className="scale-[1.264] object-cover"
              />
            </div>
            <div className="relative aspect-square h-[52.63%] overflow-hidden bg-mist">
              <Image
                src="/images/women-wellness-web.webp"
                {...blur("/images/women-wellness-web.webp")}
                alt="Women Wellness website on a laptop"
                fill
                loading="eager"
                sizes="(min-width: 1024px) 146px, (min-width: 900px) 77px, 64px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-auto w-full pt-[clamp(1.75rem,3.333vw,3rem)]">
            <Button href="/#projects" variant="ink" className="w-full">
              Explore the portfolio
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-[clamp(26.25rem,60vw,37.5rem)] flex-col justify-end overflow-hidden bg-mist p-[clamp(1.25rem,2.431vw,2.1875rem)] animate-settle [animation-delay:.1s] lg:min-h-0">
          <Image
            src="/images/hero-panel.webp"
            {...blur("/images/hero-panel.webp")}
            alt="Rita — graphic and web designer"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1440px) 45.83vw, (min-width: 925px) 46vw, calc(100vw - 2.5rem)"
            className="object-cover object-[50%_93.21%] animate-hero-zoom"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[clamp(7.5rem,14.167vw,12.75rem)] bg-linear-to-t from-ink/70 to-transparent" />
          <Button href="/#services" variant="cream" className="relative w-full">
            Explore the services
          </Button>
        </div>
      </section>
    </Container>
  );
}
