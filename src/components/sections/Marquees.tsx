import { Marquee } from "@/components/ui/Marquee";
import { marqueeWords } from "@/content/home";

/** Three stacked bands (pink · cream · pink) between Services and Process. */
export function ServicesMarquee() {
  return (
    <div className="mt-section flex flex-col overflow-hidden">
      <Marquee words={marqueeWords} tone="pink" duration={42} />
      <Marquee words={marqueeWords} tone="cream" reverse duration={50} />
      <Marquee words={marqueeWords} tone="pink" duration={46} />
    </div>
  );
}

/** Single cream band before the footer. Home repeats "let’s work together"; case studies mix the services in. */
export function CtaMarquee({ words = Array<string>(4).fill("let’s work together") }: { words?: string[] }) {
  return (
    <div className="mt-section overflow-hidden">
      <Marquee words={words} tone="cream" duration={44} />
    </div>
  );
}
