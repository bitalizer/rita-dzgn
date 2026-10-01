import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Display } from "@/components/ui/Typography";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <section className="pt-section pb-section">
            <Display as="h1" label="(404)">
              This page doesn’t exist. The work does.
            </Display>
            <div className="mt-[clamp(40px,4.583vw,66px)] flex flex-wrap gap-5 lg:ml-[16.94%]">
              <Button href="/" variant="cream">
                Back home
              </Button>
              <Button href="/projects/" variant="pink">
                View projects
              </Button>
            </div>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
