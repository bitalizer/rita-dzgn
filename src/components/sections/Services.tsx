import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Tag } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Typography";
import { services } from "@/content/home";
import { cn } from "@/lib/cn";

const gap = "clamp(28px,4.028vw,58px)";

/** Left: heading + image + CTA (320 col). Right: four price rows separated by 0.5px lines (776 col). */
export function Services() {
  return (
    <Container>
      <section id="services" aria-labelledby="services-title" className="pt-section">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[320fr_244fr_776fr] lg:items-start">
          <div className="flex flex-col gap-[clamp(56px,10.625vw,153px)] lg:col-start-1">
            <Reveal>
              <SectionHeading label="(my services)" title={<span id="services-title">services</span>} />
            </Reveal>
            <Reveal className="flex flex-col gap-[30px]">
              <div className="relative aspect-[320/249] overflow-hidden bg-mist">
                <Image
                  src="/images/services.webp"
                  alt="Poster campaign for a wellness brand"
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="origin-[71%_0] scale-[1.07] object-cover object-[71%_0]"
                />
              </div>
              <div className="flex flex-col gap-[15px]">
                <h3 className="text-sub font-semibold">Ideas deserve good design</h3>
                <p className="text-body text-cream">
                  No templates. No unnecessary noise. Just thoughtful design built around your idea, your personality and what makes you different.
                </p>
              </div>
              <Button href="/#contact" variant="cream" className="w-full">
                Start a project
              </Button>
            </Reveal>
          </div>

          <div className="flex flex-col lg:col-start-3">
            {services.map((s, i) => {
              const first = i === 0;
              const last = i === services.length - 1;
              return (
                <Reveal
                  key={s.title}
                  className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", !last && "border-b-[0.5px] border-paper/30")}
                  style={{ paddingTop: first ? 0 : gap, paddingBottom: last ? 0 : gap }}
                >
                  <div className="flex flex-col items-start gap-5">
                    <Tag>{s.price}</Tag>
                    <h3 className="max-w-[340px] text-title font-medium text-cream">{s.title}</h3>
                  </div>
                  <p className="w-full text-body text-cream lg:w-[320px] lg:flex-none">{s.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </Container>
  );
}
