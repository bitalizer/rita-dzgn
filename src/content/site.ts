/** Site-wide settings. */
export const site = {
  name: "rita.dzgn",
  author: "Rita",
  role: "Graphic & web designer",
  title: "rita.dzgn — graphic & web designer",
  description:
    "Graphic & web designer specializing in logo design, visual identity and website design. Distinctive brands and digital experiences that combine thoughtful visuals, clear structure and personality.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ritadzgn.com",
  locale: "en",
  contact: {
    email: "ritasobrak@gmail.com",
    whatsapp: "https://wa.me/37258062145",
    telegram: "https://t.me/ritasobrak",
    instagram: "https://instagram.com/rita.dzgn",
  },
  privacyPolicyUrl: "/privacy/",
  /** Cloudflare Web Analytics site token (public: it is part of the snippet the dashboard shows). */
  webAnalyticsToken: "ea79f5530e6445f7bb1e885fa6c7e8f6",
} as const;

export type NavItem = { label: string; href: string };

/** Left cluster of the header. */
export const primaryNav: NavItem[] = [
  { label: "(about me)", href: "/#about" },
  { label: "(projects)", href: "/#projects" },
  { label: "(services)", href: "/#services" },
];

/** Right cluster of the header. */
export const secondaryNav: NavItem[] = [
  { label: "(FAQ)", href: "/#faq" },
  { label: "(work steps)", href: "/#process" },
  { label: "(contact me)", href: "/#contact" },
];

export const contactLinks: NavItem[] = [
  { label: "Email", href: `mailto:${site.contact.email}` },
  { label: "Whatsapp", href: site.contact.whatsapp },
  { label: "Telegram", href: site.contact.telegram },
  { label: "Instagram", href: site.contact.instagram },
];
