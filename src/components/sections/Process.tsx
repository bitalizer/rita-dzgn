import { Highlight } from "@/components/ui/Highlight";
import { Container } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { steps } from "@/content/home";
import { cn } from "@/lib/cn";

/** "(work process)" statement + four numbered steps with hairline dividers. */
export function Process() {
  return (
    <Container>
      <section id="process" aria-labelledby="process-title" className="pt-section">
        <Reveal as="h2" id="process-title" className="text-display font-extrabold">
          <span className="float-left w-[max(120px,16.94%)] text-label font-normal">(work process)</span>
          Turning ideas into design through a clear process built around <Highlight tone="glass">creativity, clarity and collaboration.</Highlight>
        </Reveal>

        <Reveal className="mt-[clamp(48px,6.944vw,100px)] grid grid-cols-1 gap-[30px] text-cream md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.index}
              className={cn(
                "flex flex-col gap-[42px] border-paper/30",
                // Hairlines: between stacked steps on phones, under the first row of the 2-column tablet grid, between columns on desktop.
                i < steps.length - 1 && "border-b-[0.5px] pb-[30px] lg:border-b-0 lg:border-r-[0.5px] lg:pb-0 lg:pr-[10px]",
                i >= 2 && "md:border-b-0 md:pb-0",
              )}
            >
              <div className="flex flex-col gap-5">
                <span className="text-right text-body">{step.index}</span>
                <h3 className="text-title font-medium">{step.title}</h3>
                <span className="text-sub font-semibold">{step.subtitle}</span>
              </div>
              <p className="text-body">{step.description}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </Container>
  );
}
