export type Service = { price: string; title: string; description: string };

export const services: Service[] = [
  {
    price: "from 500€",
    title: "Logo design & Visual identity",
    description:
      "I create cohesive visual identities that bring a brand to life — from the logo and typography to colors, graphic elements and the details that make it recognizable.",
  },
  {
    price: "from 500€",
    title: "Website design",
    description:
      "I design websites that balance visual impact, clear structure and usability — turning ideas into digital experiences that are easy and enjoyable to navigate.",
  },
  {
    price: "from 800€",
    title: "Website development",
    description:
      "I bring the design to life as a responsive, functional website. Design is included in the process, so the final result stays true to the original concept.",
  },
  {
    price: "from 100€",
    title: "Other services",
    description:
      "Presentations, business cards, print materials, social media graphics and other design needs — keeping every touchpoint consistent with your visual identity.",
  },
];

/** Words in the running marquee band between Services and Process. */
export const marqueeWords = ["logo design", "visual identity", "website design", "website development", "graphic design"];

export type Step = { index: string; title: string; subtitle: string; description: string };

export const steps: Step[] = [
  {
    index: "(01)",
    title: "Discovery",
    subtitle: "Getting to know the project",
    description: "We start by discussing your goals, ideas and expectations to understand what needs to be created and what the project should achieve.",
  },
  {
    index: "(02)",
    title: "Concept",
    subtitle: "Finding the right direction",
    description:
      "I explore ideas, references and visual directions to build a concept that feels relevant to your project and sets the foundation for the design.",
  },
  {
    index: "(03)",
    title: "Design",
    subtitle: "Bringing the idea to life",
    description:
      "Once the direction is clear, I develop the visual solution — from the first layouts and compositions to typography, color and all the important details.",
  },
  {
    index: "(04)",
    title: "Refine",
    subtitle: "Making every detail count",
    description: "We review the result, refine the details and make thoughtful adjustments until everything feels clear, cohesive and just right.",
  },
];

export type Stat = { value: string; label: string; description: string };

export const stats: Stat[] = [
  {
    value: "5+",
    label: "years in design",
    description: "Working across graphic design, branding and digital experiences — from the first idea to the final detail.",
  },
  {
    value: "20+",
    label: "brands brought to life",
    description: "Creating visual identities that give brands a clear voice, recognizable character and a strong visual system.",
  },
  {
    value: "40+",
    label: "websites designed",
    description: "From landing pages to full digital experiences — combining visual direction, structure and usability.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "What types of projects do you work on?",
    a: "Mostly brand identities and websites: logo design, full visual identity systems, landing pages and multi-page sites. I also take on smaller pieces — presentations, print materials, social media graphics — when they help keep a brand consistent.",
  },
  {
    q: "How long does the project usually take?",
    a: "A logo & visual identity usually takes 2–4 weeks, a website design 3–6 weeks depending on the number of pages. Design plus development runs 6–10 weeks. You get a clear timeline before we start.",
  },
  {
    q: "What does the work process look like?",
    a: "Four steps: discovery, concept, design and refinement. We start by going through your goals and expectations, I propose a direction, then develop it into the final design with review rounds along the way.",
  },
  {
    q: "What do you need from me to start?",
    a: "A short brief about your business, examples of what you like (and don’t), and any existing materials — logo, texts, photos. No brief yet? Send me a message and we’ll put it together step by step.",
  },
  {
    q: "How do we keep in touch during the project?",
    a: "Mostly via Telegram, WhatsApp or e-mail — whichever is easiest for you. Feedback and decisions stay in writing, so nothing gets lost and you can reply whenever it suits you.",
  },
  {
    q: "Do you also develop the websites you design?",
    a: "Yes. I can hand over a build-ready design or deliver the finished, responsive website myself — so the result stays true to the original concept.",
  },
];

export const projectTypes = [
  { value: "identity", label: "Logo design & visual identity" },
  { value: "web-design", label: "Website design" },
  { value: "web-dev", label: "Website design + development" },
  { value: "other", label: "Other" },
];

export const budgets = [
  { value: "lt500", label: "under 500€" },
  { value: "500-1000", label: "500 – 1 000€" },
  { value: "1000-2500", label: "1 000 – 2 500€" },
  { value: "gt2500", label: "2 500€ +" },
];
