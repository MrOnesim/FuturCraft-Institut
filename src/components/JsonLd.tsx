import { CONTACT, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

type JsonLdValue = Record<string, unknown>;

/**
 * Injecte un ou plusieurs objets JSON-LD (schema.org) dans la page.
 * Les caractères `<` sont échappés pour éviter toute fermeture prématurée du script.
 */
export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Fabriques d'objets schema.org                                       */
/* ------------------------------------------------------------------ */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Référence compacte à l'établissement (les outils Google préfèrent nom + url inline). */
export function organizationRef(): JsonLdValue {
  return { "@type": "EducationalOrganization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL };
}

/** « 9 mois » → « P9M », « 6 semaines » → « P6W », « 40 heures » → « PT40H » (ISO 8601). */
export function isoDuration(text: string): string | undefined {
  const m = text.toLowerCase().match(/(\d+)\s*(mois|semaine|heure|jour)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  switch (m[2]) {
    case "mois":
      return `P${n}M`;
    case "semaine":
      return `P${n}W`;
    case "jour":
      return `P${n}D`;
    default:
      return `PT${n}H`;
  }
}

/** L'établissement : utilisé sur toutes les pages et référencé par les autres objets. */
export function organizationJsonLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "FuturCraft",
    url: SITE_URL,
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl("/opengraph-image"),
    description:
      "Centre de formation professionnelle aux métiers du numérique au Bénin : développement web, intelligence artificielle, design, drone, marketing digital, audiovisuel.",
    telephone: CONTACT.phonePrimaryE164,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.addressLine,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.region,
      addressCountry: CONTACT.country,
    },
    openingHours: [...CONTACT.hours],
    areaServed: { "@type": "Country", name: "Bénin" },
    sameAs: Object.values(CONTACT.socials),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "admissions",
        telephone: CONTACT.phonePrimaryE164,
        email: CONTACT.email,
        availableLanguage: ["fr"],
      },
    ],
  };
}

export function websiteJsonLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "fr",
    publisher: organizationRef(),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Fiche formation → schema.org/Course (résultats enrichis « Cours » de Google). */
export function courseJsonLd(formation: {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  duration: string;
  level: string;
  price: number;
  mode: string;
  campus: string;
  imageUrl: string;
  competencies: string[];
  jobs: string[];
  sessions?: { name: string; startDate: string; endDate: string }[];
}): JsonLdValue {
  const url = absoluteUrl(`/formation/${formation.slug}`);
  const isOnline = /ligne|distance|hybride/i.test(formation.mode);
  const isOnsite = /présentiel|presentiel|hybride/i.test(formation.mode);
  const courseMode = isOnline && isOnsite ? "Blended" : isOnline ? "Online" : "Onsite";
  const workload = isoDuration(formation.duration);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    url,
    name: formation.title,
    description: formation.shortDescription,
    image: formation.imageUrl.startsWith("/") ? absoluteUrl(formation.imageUrl) : formation.imageUrl,
    inLanguage: "fr",
    provider: organizationRef(),
    educationalLevel: formation.level.split(" (")[0],
    about: formation.category,
    teaches: formation.competencies.slice(0, 10),
    occupationalCredentialAwarded: "Certificat Professionnel de Compétences FuturCraft",
    ...(workload && { timeRequired: workload }),
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: formation.price,
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/inscription"),
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode,
        ...(workload && { courseWorkload: workload }),
        ...(courseMode !== "Online" && {
          location: {
            "@type": "Place",
            name: `Campus FuturCraft — ${formation.campus}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: CONTACT.addressLine,
              addressLocality: CONTACT.city,
              addressCountry: CONTACT.country,
            },
          },
        }),
        instructor: { "@type": "Organization", name: `Équipe pédagogique ${SITE_NAME}` },
      },
    ],
    ...(formation.jobs.length > 0 && { audience: { "@type": "EducationalAudience", educationalRole: "student" } }),
    ...(formation.sessions && formation.sessions.length > 0
      ? {
          additionalProperty: formation.sessions.map((s) => ({
            "@type": "PropertyValue",
            name: s.name,
            value: `${s.startDate} → ${s.endDate}`,
          })),
        }
      : {}),
  };
}

/** Liste de formations (page catalogue) → ItemList de Course, pour le carrousel « Cours » de Google. */
export function courseListJsonLd(
  formations: { slug: string; title: string; shortDescription: string }[]
): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: formations.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        url: absoluteUrl(`/formation/${f.slug}`),
        name: f.title,
        description: f.shortDescription,
        provider: organizationRef(),
      },
    })),
  };
}

/** Article de blog → schema.org/Article. */
export function articleJsonLd(article: {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  publishedIso?: string;
  wordCount?: number;
}): JsonLdValue {
  const url = absoluteUrl(`/actualites/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage.startsWith("/") ? absoluteUrl(article.coverImage) : article.coverImage,
    inLanguage: "fr",
    articleSection: article.category,
    author: { "@type": "Person", name: article.author.split(",")[0].trim() },
    publisher: organizationRef(),
    ...(article.publishedIso && { datePublished: article.publishedIso }),
    ...(article.wordCount && { wordCount: article.wordCount }),
  };
}

/** Événement du campus → schema.org/Event. */
export function eventJsonLd(event: {
  slug: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  startIso?: string;
  endIso?: string;
}): JsonLdValue {
  const url = absoluteUrl(`/evenements/${event.slug}`);
  const isOnline = /ligne|online/i.test(event.location);
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "@id": `${url}#event`,
    url,
    name: event.title,
    description: event.description,
    image: event.imageUrl.startsWith("/") ? absoluteUrl(event.imageUrl) : event.imageUrl,
    inLanguage: "fr",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: isOnline
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    ...(event.startIso && { startDate: event.startIso }),
    ...(event.endIso && { endDate: event.endIso }),
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.addressLine,
        addressLocality: CONTACT.city,
        addressCountry: CONTACT.country,
      },
    },
    organizer: organizationRef(),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}
