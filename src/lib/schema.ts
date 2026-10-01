import type { Project } from "@/content/projects";
import { site } from "@/content/site";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author,
    alternateName: site.name,
    jobTitle: site.role,
    url: site.url,
    email: site.contact.email,
    address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.countryCode },
    sameAs: [site.contact.instagram, site.contact.telegram],
    knowsAbout: ["Logo design", "Visual identity", "Website design", "Website development", "Graphic design"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
  };
}

export function projectSchema(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${p.title} ${p.category}`,
    url: `${site.url}/projects/${p.slug}/`,
    image: `${site.url}${p.cover.src}`,
    dateCreated: p.year,
    description: p.intro,
    creator: { "@type": "Person", name: site.author, url: site.url },
    genre: p.services,
  };
}
