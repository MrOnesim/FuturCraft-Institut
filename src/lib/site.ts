/**
 * Informations globales du site, partagées entre les métadonnées, le sitemap,
 * les données structurées (JSON-LD) et les emails.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  // Sur Vercel, l'URL de production est exposée sans protocole.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "https://futurcraft.bj";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "FuturCraft Institut";

export const SITE_DESCRIPTION =
  "Centre de formation aux métiers du numérique au Bénin : Développement Web, Intelligence Artificielle, Web Design, Pilotage de Drone, Marketing Digital, Graphisme & Audiovisuel. Campus de Godomey, Cotonou.";

export const CONTACT = {
  phonePrimary: "+229 43 32 78 32",
  phonePrimaryE164: "+22943327832",
  phoneSecondary: "+229 01 97 30 30 50",
  phoneSecondaryE164: "+2290197303050",
  whatsapp: "22943327832",
  email: "contact@futurcraftinstitut.com",
  emailAlt: "eentreprisebenin@gmail.com",
  addressLine: "Godomey, Supermarché O Bénin, avant PK14",
  city: "Abomey-Calavi",
  region: "Atlantique",
  country: "BJ",
  hours: ["Mo-Fr 08:00-18:30", "Sa 09:00-14:00"],
  socials: {
    facebook: "https://facebook.com/futurcraftinstitue",
    instagram: "https://instagram.com/futurcraft_institut",
    linkedin: "https://linkedin.com/company/futurcraft-institut",
    tiktok: "https://tiktok.com/@futurcraft_institut",
  },
} as const;

/** URL absolue à partir d'un chemin (ex. `/formations`). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Lien WhatsApp avec message pré-rempli. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Slug ASCII stable à partir d'un titre (accents retirés, ponctuation → tirets). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
