import Image from "next/image";
import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { contactLinks } from "@/content/site";
import { blur } from "@/lib/blur";

/** "(let’s work together)" heading + photo/links on the left (773 col), form on the right (547 col). */
export function Contact() {
  return (
    <Container>
      <section id="contact" aria-labelledby="contact-title" className="pt-section">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[773fr_20fr_547fr] lg:items-start">
          <div className="lg:col-start-1">
            <Reveal as="h2" id="contact-title" className="text-display font-extrabold">
              <span className="block text-label font-normal mb-[1.875rem] lg:float-left lg:mb-0 lg:w-[max(9.375rem,29.366%)]">(let’s work together)</span>
              Got an idea? Tell me about it.
            </Reveal>
            <Reveal className="mt-[clamp(2.5rem,4.583vw,4.125rem)] flex w-full flex-col items-center gap-[1.875rem] text-center lg:ml-[31.177%] lg:w-[37.645%]">
              <div className="relative aspect-[208/279] w-[71.478%] max-w-[13rem] overflow-hidden bg-mist">
                <Image src="/images/deco.webp" {...blur("/images/deco.webp")} alt="Lagi outdoor posters" fill sizes="208px" className="object-cover" />
              </div>
              <p className="text-label">
                {contactLinks.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && " // "}
                    <a
                      href={l.href}
                      target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="transition-opacity hover:opacity-60"
                    >
                      {l.label}
                    </a>
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-start-3">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </Container>
  );
}
