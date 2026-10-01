import Image from "next/image";
import { FaqList } from "@/components/sections/FaqList";
import { Highlight } from "@/components/ui/Highlight";
import { Container, Panel } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Typography";
import { faqs } from "@/content/home";
import { blur } from "@/lib/blur";

/** Cream panel: centered heading, 700px accordion, two decorative photos flanking it (lg+). */
export function Faq() {
  return (
    <Container>
      <section id="faq" aria-labelledby="faq-title" className="pt-section">
        <Panel className="pb-panel">
          <Reveal>
            <SectionHeading
              align="center"
              label="(common questions)"
              className="mx-auto max-w-[916px]"
              title={
                <span id="faq-title">
                  <Highlight tone="pink">Get quick answers</Highlight> about working with me and my approach.
                </span>
              }
            />
          </Reveal>

          <div className="mt-[clamp(40px,4.861vw,70px)] flex justify-center">
            <div className="relative w-full max-w-[700px]">
              <div aria-hidden="true" className="absolute top-0 left-[max(-20.139vw,-290px)] hidden aspect-[183/189] w-[min(12.708vw,183px)] lg:block">
                <Image src="/images/deco.webp" {...blur("/images/deco.webp")} alt="" fill sizes="183px" className="object-cover" />
              </div>
              <div aria-hidden="true" className="absolute top-[206px] right-[max(-20.139vw,-290px)] hidden aspect-[183/189] w-[min(12.708vw,183px)] lg:block">
                <Image src="/images/pihaspa.webp" {...blur("/images/pihaspa.webp")} alt="" fill sizes="183px" className="object-cover" />
              </div>
              <Reveal>
                <FaqList items={faqs} />
              </Reveal>
            </div>
          </div>
        </Panel>
      </section>
    </Container>
  );
}
