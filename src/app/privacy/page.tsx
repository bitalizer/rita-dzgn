import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Layout";
import { Display } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { ogBase, ogImage } from "@/lib/seo";

const title = "Privacy Policy";
const description = `How ${site.name} handles personal data sent through the contact form, in line with the GDPR.`;
const updated = "1 October 2026";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy/" },
  openGraph: { ...ogBase, url: "/privacy/", title: `${title} — ${site.name}`, description, images: [ogImage] },
};

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sub font-semibold">{heading}</h2>
      {children}
    </section>
  );
}

const mail = (
  <a href={`mailto:${site.contact.email}`} className="underline underline-offset-[3px]">
    {site.contact.email}
  </a>
);

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <article className="pt-section pb-section">
            <Display as="h1" label="(legal)">
              privacy policy
            </Display>
            <div className="mt-[clamp(40px,4.583vw,66px)] flex max-w-[720px] flex-col gap-10 text-body lg:ml-[16.94%] [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
              <p className="text-cream/60">Last updated: {updated}</p>

              <Section heading="Who is responsible">
                <p>
                  This website is run by {site.author} ({site.name}), a freelance graphic and web designer. {site.author} is the controller of the personal data
                  described here under the EU General Data Protection Regulation (GDPR). For any privacy question or request, write to {mail}.
                </p>
              </Section>

              <Section heading="What this website does not do">
                <p>
                  No cookies, no analytics, no advertising or tracking scripts, and nothing is stored in your browser. Fonts are served from this website, so no
                  request is made to Google or other font services.
                </p>
              </Section>

              <Section heading="Contact form">
                <p>When you send the contact form, the following is transmitted:</p>
                <ul>
                  <li>your name and e-mail address;</li>
                  <li>the project type, budget and message you enter;</li>
                  <li>the address of the page the form was sent from.</li>
                </ul>
                <p>
                  The data is used only to reply to your inquiry and, if we decide to work together, to prepare and carry out the project. The legal basis is
                  Art. 6(1)(b) GDPR (steps taken at your request before entering into a contract) and, for general questions, Art. 6(1)(f) GDPR (the legitimate
                  interest in answering messages).
                </p>
                <p>
                  The form is delivered as a private message to {site.author} via Telegram. It is not sold, shared for marketing or used for automated
                  decision-making.
                </p>
              </Section>

              <Section heading="Hosting">
                <p>
                  The website is served by Cloudflare, Inc. To deliver pages and protect the site against abuse, Cloudflare processes technical data such as
                  your IP address, browser type and the time of the request. This is necessary to operate the website (Art. 6(1)(f) GDPR). Cloudflare acts as a
                  processor under a data processing agreement.
                </p>
              </Section>

              <Section heading="Transfers outside the EU">
                <p>
                  Cloudflare (USA) and Telegram (outside the EU) may process data outside the European Economic Area. Cloudflare is certified under the EU–US
                  Data Privacy Framework and both providers rely on the European Commission’s Standard Contractual Clauses for such transfers.
                </p>
              </Section>

              <Section heading="Messengers and social links">
                <p>
                  If you contact {site.author} via e-mail, WhatsApp, Telegram or Instagram, the message is processed by that service under its own privacy
                  policy. The links on this website are plain links: nothing is loaded from those services until you click one.
                </p>
              </Section>

              <Section heading="How long data is kept">
                <p>
                  Inquiries are deleted once they are no longer needed, at the latest 12 months after the last contact. If a project follows, data needed for
                  invoicing is kept for as long as accounting law requires.
                </p>
              </Section>

              <Section heading="Your rights">
                <p>Under the GDPR you can at any time:</p>
                <ul>
                  <li>ask which data about you is held and receive a copy;</li>
                  <li>have incorrect data corrected or your data deleted;</li>
                  <li>restrict or object to its processing;</li>
                  <li>receive your data in a portable format.</li>
                </ul>
                <p>Send requests to {mail}. You also have the right to lodge a complaint with the data protection authority in your country of residence.</p>
              </Section>

              <Section heading="Changes">
                <p>This policy is updated when the website or the way data is handled changes. The date at the top shows the current version.</p>
              </Section>
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
