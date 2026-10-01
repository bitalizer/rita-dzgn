import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { blur } from "@/lib/blur";

const bio = [
  "I’ve loved drawing ever since I was a child, and I always knew I wanted to build my career around something creative. Today, I genuinely love what I do and feel lucky to be working in a field that truly feels like mine.",
  "I have a background in both web and graphic design, giving me a well-rounded approach to visual and digital projects.",
  "I’m always exploring new trends and expanding my visual perspective to keep my work fresh, contemporary and relevant.",
];

/** Big statement + bio / portrait / "Contact me" row (columns 567 · 291 · 162 · 320). */
export function AboutIntro() {
  return (
    <Container>
      <section id="about" aria-labelledby="about-title" className="pt-section">
        <Reveal as="h2" id="about-title" className="text-display font-extrabold">
          <span className="float-left w-[max(7.5rem,16.94%)] text-label font-normal">(about me)</span>
          Part designer, part thinker, part problem solver. I turn ideas into visual identities, digital experiences, and things{" "}
          <Highlight tone="glass">worth remembering.</Highlight>
        </Reveal>

        <div className="mt-[clamp(3.5rem,8.819vw,7.9375rem)] flex flex-col gap-6 lg:grid lg:grid-cols-[567fr_291fr_162fr_320fr] lg:items-start">
          <Reveal className="order-1 text-body lg:col-start-2 lg:order-none">
            <div className="flex flex-col gap-[1.3em]">
              {bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="relative order-2 aspect-[320/322] w-full overflow-hidden bg-mist lg:col-start-4 lg:order-none lg:max-w-[20rem]">
            <Image
              src="/images/about.webp"
              {...blur("/images/about.webp")}
              alt="Portrait of Rita"
              fill
              sizes="(min-width: 1440px) 22.22vw, (min-width: 1024px) 320px, 100vw"
              className="object-cover object-[50%_16.736%]"
            />
          </Reveal>
          <Reveal className="order-3 lg:col-start-1 lg:row-start-1 lg:order-none lg:self-end">
            <Button href="/#contact" variant="cream" className="w-full lg:w-auto lg:min-w-[14.1875rem]">
              Contact me
            </Button>
          </Reveal>
        </div>
      </section>
    </Container>
  );
}
