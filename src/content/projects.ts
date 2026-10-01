export type Img = { src: string; width: number; height: number; alt: string };
/** half = one of a 660×743 pair · full = a 1340×754 (16:9) tile. Consecutive halves pair up; a lone half renders full. */
export type GalleryImage = Img & { span: "half" | "full" };
export type Kind = "identity" | "web";

export type Project = {
  slug: string;
  title: string;
  /** Completes the page heading: "<title> <category>", and shows in brackets on cards. */
  category: string;
  kinds: Kind[];
  /** Shown on cards. */
  year: string;
  /** Meta row, left column (from the designer's case-study PDFs). */
  industry: string;
  /** Meta row, right column. */
  services: string[];
  cover: Img;
  /** The 433px paragraph next to industry/services — also the meta description. */
  intro: string;
  /** "About the project" paragraphs. Empty array hides the block. */
  about: string[];
  gallery: GalleryImage[];
};

export const filters: Array<{ key: Kind | "all"; label: string }> = [
  { key: "all", label: "(all)" },
  { key: "identity", label: "(logo & identity)" },
  { key: "web", label: "(websites)" },
];

const img = (src: string, width: number, height: number, alt: string): Img => ({ src: `/images/${src}.webp`, width, height, alt });
/** 16:9 exports from the designer's boards — 2800×1575 masters (Behance lightbox size). */
const wide = (src: string, alt: string): GalleryImage => ({ ...img(src, 2800, 1575, alt), span: "full" });
/** Portrait exports (1778×2000 / 1600×2000) → one of a pair. */
const tall = (src: string, alt: string, width = 1600): GalleryImage => ({ ...img(src, width, 2000, alt), span: "half" });
const half = (src: string, width: number, height: number, alt: string): GalleryImage => ({ ...img(src, width, height, alt), span: "half" });
const full = (src: string, width: number, height: number, alt: string): GalleryImage => ({ ...img(src, width, height, alt), span: "full" });

/** Order = fill order of the /projects checkerboard. Home picks its cards by slug. */
export const projects: Project[] = [
  {
    slug: "betonipinnat",
    title: "Betonipinnat",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2025",
    industry: "concrete floor services",
    services: ["logo design", "visual identity"],
    cover: img("betonipinnat-09", 1778, 2000, "Betonipinnat logo stickers on orange"),
    intro:
      "Betonipinnat is a Finnish company specializing in the creation, leveling and restoration of concrete floors, combining advanced technology with a focus on quality and efficiency.",
    about: [
      "The logo is built around a geometric monogram “BP”, created from angular shapes that reference the structure and precision of concrete work. The sharp, architectural forms give the symbol a strong and technical character while keeping it simple and easy to recognize.",
      "The dark colors reinforce the brand’s connection to concrete, construction and industrial environments, while the minimal visual language communicates precision, reliability and a modern approach.",
      "The identity was designed to work across different applications, from workwear and vehicles to digital and printed materials, maintaining a clear and recognizable presence in every context.",
    ],
    gallery: [
      tall("betonipinnat-08", "Betonipinnat — BP monogram", 1778),
      tall("betonipinnat-09", "Betonipinnat — sticker roll", 1778),
      wide("betonipinnat-10", "Betonipinnat — building signage"),
      wide("betonipinnat-04", "Betonipinnat — safety helmet"),
      wide("betonipinnat-05", "Betonipinnat — business cards"),
      wide("betonipinnat-06", "Betonipinnat — workwear jacket"),
      wide("betonipinnat-07", "Betonipinnat — social media"),
      wide("betonipinnat-03", "Betonipinnat — color palette"),
      wide("betonipinnat-02", "Betonipinnat — logo grid"),
      wide("betonipinnat-01", "Betonipinnat — logo construction"),
    ],
  },
  {
    slug: "women-wellness-identity",
    title: "Women Wellness",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2026",
    industry: "women’s wellness club",
    services: ["logo design", "visual identity"],
    cover: img("women-wellness-identity", 1600, 1600, "Women Wellness branded yoga mats"),
    intro:
      "Women Wellness is an online wellness club created to help women build a healthier relationship with their bodies. The platform combines structured workout programs, balanced nutrition recipes, and ongoing support, while helping women better understand and care for their bodies throughout the menstrual cycle.",
    about: [
      "The Women Wellness logo is a typographic identity that reflects the brand’s core philosophy - mindful self-care, women’s health, and harmony with the body.",
      "The word women is set in a clean, contemporary typeface, representing confidence, stability, and inner strength. In contrast, the word wellness is rendered in a soft italic style, adding a sense of femininity, care, and fluidity.",
      "The minimalist combination of the two type styles creates a visual balance between strength and softness — the central idea behind the Women Wellness identity.",
    ],
    gallery: [
      // 16:9 boards full width, portraits paired.
      half("wwid-01", 1321, 1486, "Are you ready to join other women? — social post"),
      half("wwid-02", 1321, 1486, "women’s online health club — A4 poster"),
      full("wwid-03", 2680, 1508, "Women Wellness — logo"),
      half("wwid-04", 1321, 1486, "Women Wellness — hoodie"),
      half("wwid-05", 1321, 1486, "Women’s online health club — poster"),
      full("wwid-06", 2680, 1508, "Women Wellness — poster series"),
      full("wwid-07", 2680, 1508, "Women Wellness — board"),
      half("wwid-08", 1321, 1486, "Women Wellness — branding"),
      half("wwid-09", 1321, 1486, "Women Wellness — branding"),
      full("wwid-10", 2680, 1508, "Women Wellness — board"),
      half("wwid-11", 1321, 1486, "Women Wellness — branding"),
      half("wwid-12", 1321, 1486, "Women Wellness — branding"),
      full("wwid-13", 2680, 1508, "Women Wellness — board"),
      half("wwid-14", 1321, 1486, "Women Wellness — branding"),
      half("wwid-15", 1321, 1486, "Women Wellness — branding"),
      full("wwid-16", 2680, 1508, "Women Wellness — board"),
      half("wwid-17", 1321, 1486, "Women Wellness — branding"),
      half("wwid-18", 1321, 1486, "Women Wellness — branding"),
      half("wwid-19", 1321, 1486, "Women Wellness — branding"),
      half("wwid-20", 1321, 1486, "Women Wellness — branding"),
      half("wwid-21", 1321, 1486, "Women Wellness — branding"),
      half("wwid-22", 1321, 1486, "Women Wellness — branding"),
    ],
  },
  {
    slug: "marketing-sharks",
    title: "Marketing Sharks",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2025",
    industry: "marketing agency",
    services: ["logo design", "visual identity"],
    cover: img("marketing-sharks-02", 2000, 1125, "Marketing Sharks business card on pink foam"),
    intro: "A bold and playful visual identity created for Marketing Sharks, a modern marketing agency.",
    about: [
      "The identity combines a distinctive shark symbol with strong typography and a high-contrast visual language to create a brand that feels confident, energetic and memorable.",
      "The system was designed to work across both digital and physical touchpoints, from business cards and apparel to branded communication materials.",
      "The visual direction uses black, white and vibrant accent colors to create a sharp contrast and give the brand a recognizable personality within the marketing industry. A combination of oversized typography, graphic shapes and playful details adds energy while keeping the overall identity cohesive.",
    ],
    gallery: [
      wide("marketing-sharks-01", "Marketing Sharks — logo"),
      wide("marketing-sharks-05", "Marketing Sharks — billboard"),
      wide("marketing-sharks-02", "Marketing Sharks — business card"),
      wide("marketing-sharks-03", "Marketing Sharks — t-shirts"),
      wide("marketing-sharks-06", "Marketing Sharks — poster series"),
      wide("marketing-sharks-09", "Marketing Sharks — tote bag"),
      wide("marketing-sharks-07", "Marketing Sharks — website"),
      wide("marketing-sharks-04", "Marketing Sharks — graphic elements"),
      wide("marketing-sharks-08", "Marketing Sharks — color palette"),
    ],
  },
  {
    slug: "women-wellness-website",
    title: "Women Wellness",
    category: "website design",
    kinds: ["web"],
    year: "2026",
    industry: "women’s wellness club",
    services: ["website design"],
    cover: img("ww-web-07", 1600, 2000, "Women Wellness website on a laptop"),
    intro:
      "Women Wellness is more than just a website. It is a comprehensive online platform that brings together workouts, nutrition, challenges, menstrual cycle tracking and a community for women.",
    about: [
      "The main challenge was not only to create a visually appealing interface, but to build a clear and intuitive platform structure that would feel comfortable and easy to use. The website was designed in a clean, modern style with soft shapes, fully reflecting the brand’s visual identity.",
      "Beyond the standard website pages, the project required designing the platform’s internal experience — from the moment a user logs into her account to how she navigates between different sections.",
      "The nutrition section includes a calorie calculator and a variety of recipes. The workout section offers home workouts, strength programmes, meditation and yoga. The community section allows members to create posts, share their experiences and keep track of upcoming club events.",
      "Users can also track their menstrual cycle and receive personalised nutrition and workout recommendations based on their current cycle phase.",
    ],
    gallery: [
      tall("ww-web-07", "Women Wellness — website on a laptop"),
      tall("ww-web-03", "Women Wellness — campaign photo"),
      wide("ww-web-01", "Women Wellness — home page on a laptop"),
      tall("ww-web-02", "Women Wellness — landing pages"),
      tall("ww-web-04", "Women Wellness — member area screens"),
      wide("ww-web-06", "Women Wellness — dashboard, recipes and nutrition"),
      tall("ww-web-05", "Women Wellness — page structure"),
      tall("ww-web-08", "Women Wellness — campaign photo"),
      wide("ww-web-09", "Women Wellness — community and cycle tracking"),
    ],
  },
  {
    slug: "found-faithful",
    title: "Found Faithful",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2026",
    industry: "women’s spiritual mentorship",
    services: ["logo design", "visual identity"],
    cover: img("found-faithful-04", 2000, 1125, "Found Faithful business cards"),
    intro:
      "Create a logo for Found Faithful that visually reflects the brand’s core: a woman’s journey from spiritual uncertainty and inner instability to rootedness, peace, and confidence in God.",
    about: [
      "The logo should communicate gentle spiritual mentorship, safety, and trust while remaining modern, refined, and mature. The main objective is to create a symbol that feels spiritual, warm, and professional — simple enough to work across different formats.",
      "This logo concept is inspired by the themes of faith, guidance, clarity, and spiritual grounding. The cross placed at the heart of the radiant mark represents faith as the foundation of the brand, while the surrounding rays symbolize God’s presence, renewal, and the journey toward peace and purpose.",
      "The refined typography brings a sense of maturity, trust, and quiet elegance. The contrast between the structured “FOUND” and the graceful italic “faithful” reflects the brand’s balance of grounded confidence and gentle spiritual mentorship. Together, the mark and wordmark create a logo that feels clear, faith-centered, feminine, and professional.",
    ],
    gallery: [
      wide("found-faithful-01", "Found Faithful — logo"),
      wide("found-faithful-04", "Found Faithful — business cards"),
      wide("found-faithful-05", "Found Faithful — poster series"),
      wide("found-faithful-03", "Found Faithful — flyer"),
      wide("found-faithful-02", "Found Faithful — color palette"),
    ],
  },
  {
    slug: "lagi",
    title: "Lagi",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2025",
    industry: "real estate",
    services: ["logo design", "visual identity"],
    cover: img("lagi", 1600, 1066, "Lagi business cards on concrete"),
    intro: "Lagi is a modern real estate brand built around trust, clarity, and seamless property discovery.",
    about: [
      "The visual identity is centered around a distinctive logo that combines a contemporary wordmark with a custom-designed symbol. The symbol is a minimalist graphic mark that merges the letter “L” with an architectural form, creating a strong connection between the brand and the world of real estate.",
      "Inspired by modern architecture, the mark reflects the core values of the company: reliability, transparency, and professionalism. Its clean geometric construction conveys stability and confidence while maintaining a sophisticated and approachable appearance.",
      "Designed with versatility in mind, the symbol remains highly recognizable across all touchpoints - from digital platforms and mobile applications to signage, print materials, and social media. It can function both as part of the complete logo system and as a standalone brand asset, ensuring consistency and strong visual recognition in every context.",
      "The overall identity balances modern aesthetics with functional simplicity, creating a memorable and trustworthy brand presence that helps Lagi stand out in the competitive real estate market.",
    ],
    gallery: [
      wide("lagi-2", "Lagi — logo construction"),
      tall("lagi-3", "Lagi — symbol", 1778),
      tall("lagi-3-1", "Lagi — poster", 1778),
      tall("lagi-3-2", "Lagi — signage", 1778),
      tall("lagi-3-3", "Lagi — poster on black", 1778),
      tall("lagi-3-4", "Lagi — street poster", 1778),
      tall("lagi-4", "Lagi — campaign visual", 1778),
      tall("lagi-4-1", "Lagi — campaign poster", 1778),
      tall("lagi-4-2", "Lagi — favicon and browser tab", 1778),
      tall("lagi-4-3", "Lagi — branded t-shirt", 1778),
      tall("lagi-4-4", "Lagi — “Find your place” poster", 1778),
      wide("lagi-5", "Lagi — business cards"),
      wide("lagi-7", "Lagi — website hero"),
      wide("lagi-8", "Lagi — brochures"),
      wide("lagi-9", "Lagi — hanging banner"),
      wide("lagi-10", "Lagi — poster series"),
      wide("lagi-12", "Lagi — brand pattern"),
      wide("lagi-13", "Lagi — website on a laptop"),
      wide("lagi-14", "Lagi — stationery"),
      wide("lagi-15", "Lagi — exterior signage"),
      wide("lagi-16", "Lagi — outdoor posters"),
    ],
  },
  {
    slug: "heliosync",
    title: "Heliosync",
    category: "logo design & visual identity",
    kinds: ["identity"],
    year: "2025",
    industry: "solar power",
    services: ["logo design", "visual identity"],
    cover: img("heliosync", 1600, 1067, "Heliosync outdoor poster campaign"),
    intro:
      "Heliosync is at the forefront of innovation in Concentrated Solar Power technology. Their mission is to revolutionize Concentrated Solar Power by enhancing efficiency, reducing costs, and advancing sustainable energy solutions through innovative technology and precise engineering.",
    about: [
      "The Heliosync logo features a modern and simple font that reflects the company’s reliability and innovation. This font ensures readability across all branding materials and at any size.",
      "The symbol in the Heliosync logo is an abstract sun, chosen to represent the company’s focus on harnessing solar energy efficiently and innovatively. Its design reflects the mission to enhance sustainability through advanced solar solutions.",
      "Additionally, this symbol is composed of six parts. In many ancient cultures, the number six symbolizes harmony, balance, and completeness. This aligns with Heliosync’s approach to solar technology, where precision is key to creating efficient and effective solar power solutions.",
    ],
    gallery: [
      wide("heliosync-01", "Heliosync — wordmark construction"),
      wide("heliosync-02", "Heliosync — logo"),
      half("heliosync-03", 1910, 1900, "Heliosync — logo on light"),
      half("heliosync-04", 1910, 1900, "Heliosync — sun symbol"),
      wide("heliosync-05", "Heliosync — color palette"),
      full("heliosync-06", 2800, 1572, "Heliosync — poster series"),
      half("heliosync-07", 1910, 1900, "Heliosync — favicon and browser tab"),
      half("heliosync-08", 1910, 1900, "Heliosync — pin buttons"),
      wide("heliosync-09", "Heliosync — stationery"),
      wide("heliosync-10", "Heliosync — business cards"),
      full("heliosync-11", 2800, 1572, "Heliosync — social media posts"),
      wide("heliosync-12", "Heliosync — hoodie"),
      half("heliosync-13", 1910, 1900, "Heliosync — t-shirt"),
      half("heliosync-14", 1910, 1900, "Heliosync — flyer"),
      wide("heliosync-15", "Heliosync — website on a laptop"),
      wide("heliosync-16", "Heliosync — tote bag"),
      wide("heliosync-17", "Heliosync — bus stop posters"),
      half("heliosync-18", 1910, 1900, "Heliosync — plants on a solar panel"),
      half("heliosync-19", 1910, 1900, "Heliosync — solar panels from above"),
    ],
  },
  {
    slug: "pihaspa",
    title: "Pihaspa",
    category: "logo design & website design",
    kinds: ["identity", "web"],
    year: "2025",
    industry: "saunas & outdoor hot tubs",
    services: ["logo design", "visual identity", "website design"],
    cover: img("pihaspa", 1600, 1067, "Pihaspa website open on a laptop"),
    intro:
      "Pihaspa is a Finnish brand specializing in saunas and outdoor hot tubs. The name comes from the Finnish word “piha,” meaning “yard” — a cozy space next to your home where you can create your own private spa experience outdoors.",
    about: [
      "The simple and clean typography reflects the brand’s philosophy of calm, balance and relaxation.",
      "The drop beneath the letter “A” symbolizes water and warmth — the sensations associated with a hot sauna or relaxing in a hot tub. At the same time, the shape of the letter “A” resembles the roof of a house, reinforcing the idea of a home spa — a place to slow down, enjoy the warmth and relax right in your own backyard.",
      "The warm orange and brown colour palette is inspired by natural materials such as wood, fire and earth. Together, these tones create the atmosphere of Pihaspa — authentic outdoor relaxation, right in your own backyard.",
    ],
    gallery: [
      wide("pihaspa-01", "Pihaspa — wordmark construction"),
      wide("pihaspa-02", "Pihaspa — website on a laptop"),
      half("pihaspa-03", 2160, 2700, "Pihaspa — poster pair"),
      half("pihaspa-04", 2160, 2700, "Pihaspa — tote bag"),
      half("pihaspa-05", 2160, 2700, "Pihaspa — catalogue"),
      half("pihaspa-06", 2160, 2700, "Pihaspa — towel"),
      wide("pihaspa-07", "Pihaspa — poster wall"),
      half("pihaspa-08", 2160, 2700, "Pihaspa — sauna poster"),
      half("pihaspa-09", 2160, 2700, "Pihaspa — business card"),
      half("pihaspa-10", 2160, 2700, "Pihaspa — business cards"),
      half("pihaspa-11", 2160, 2700, "Pihaspa — poster series"),
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export type GalleryRow = { kind: "pair" | "full"; items: GalleryImage[] };

/** Consecutive half tiles pair up; a lone half becomes a full-width tile (20px gaps, pairs 660×743, fulls 1340×754). */
export function galleryRows(gallery: GalleryImage[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  const buf: GalleryImage[] = [];
  const flush = () => {
    if (buf.length) rows.push({ kind: "full", items: buf.splice(0) });
  };
  for (const g of gallery) {
    if (g.span === "full") {
      flush();
      rows.push({ kind: "full", items: [g] });
    } else {
      buf.push(g);
      if (buf.length === 2) rows.push({ kind: "pair", items: buf.splice(0) });
    }
  }
  flush();
  return rows;
}
