import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutStats } from "@/components/sections/AboutStats";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { CtaMarquee, ServicesMarquee } from "@/components/sections/Marquees";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutIntro />
        <AboutStats />
        <Projects />
        <Services />
        <ServicesMarquee />
        <Process />
        <Faq />
        <Contact />
        <CtaMarquee />
      </main>
      <Footer />
    </>
  );
}
