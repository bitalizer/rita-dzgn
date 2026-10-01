import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Container, Panel } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Typography";
import { stats } from "@/content/home";
import { blur } from "@/lib/blur";
import { cn } from "@/lib/cn";

const card = "flex min-h-[clamp(320px,30.208vw,435px)] flex-col justify-between gap-[30px] bg-pink p-[clamp(20px,2.083vw,30px)]";

function Figure({ value, label, description }: (typeof stats)[number]) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <div className="text-display font-medium">{value}</div>
        <div className="text-sub font-semibold">{label}</div>
      </div>
      <p className="text-body">{description}</p>
    </div>
  );
}

/** Cream panel: centered heading + three pink stat cards (420×435 each). */
export function AboutStats() {
  const [years, brands, sites] = stats;
  return (
    <Container>
      <section aria-labelledby="stats-title" className="pt-section">
        <Panel className="pb-panel-x">
          <Reveal>
            <SectionHeading
              align="center"
              label="(about me)"
              className="mx-auto max-w-[916px]"
              title={
                <span id="stats-title">
                  A graphic &amp; web designer turning ideas into clear <Highlight tone="pink">visual experiences</Highlight>
                </span>
              }
            />
          </Reveal>

          <div className="mt-[clamp(40px,4.861vw,70px)] grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Reveal as="article" className={card}>
              <Figure {...years} />
              <div className="relative aspect-square w-[clamp(80px,8.125vw,117px)] overflow-hidden bg-cream">
                <Image
                  src="/images/lagi.webp"
                  {...blur("/images/lagi.webp")}
                  alt="Lagi business cards"
                  fill
                  sizes="117px"
                  className="scale-[1.325] object-cover"
                />
              </div>
            </Reveal>

            <Reveal as="article" className={card}>
              <div className="flex max-w-[360px] gap-[10px]">
                {[
                  { src: "/images/women-wellness-identity.webp", alt: "Women Wellness identity" },
                  { src: "/images/thumb-2.webp", alt: "Brand detail" },
                  { src: "/images/thumb-3.webp", alt: "Brand detail" },
                ].map((img) => (
                  <div key={img.src} className="relative aspect-[111/117] flex-1 overflow-hidden bg-cream">
                    <Image src={img.src} {...blur(img.src)} alt={img.alt} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
              <Figure {...brands} />
            </Reveal>

            <Reveal as="article" className={cn(card)}>
              <Figure {...sites} />
              <Button href="/#contact" variant="ink" className="w-full">
                Start a project
              </Button>
            </Reveal>
          </div>
        </Panel>
      </section>
    </Container>
  );
}
