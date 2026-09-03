import type { MetadataRoute } from "next";
import { getBlogArticles, getEvents, getFormations } from "@/lib/data-service";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Plan du site pour les moteurs de recherche. Les pages privées (admin,
 * espace étudiant, reçus, inscription) en sont volontairement exclues.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/formations", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/admissions", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/institut", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/vie-a-futurcraft", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/projets-etudiants", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/entreprises", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/actualites", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
  ].map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    const [formations, articles, events] = await Promise.all([getFormations(), getBlogArticles(), getEvents()]);

    const formationPages: MetadataRoute.Sitemap = formations
      .filter((f) => f.isActive !== false)
      .map((f) => ({
        url: absoluteUrl(`/formation/${f.slug}`),
        lastModified: f.createdAt ?? now,
        changeFrequency: "monthly",
        priority: 0.8,
      }));

    const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
      url: absoluteUrl(`/actualites/${a.slug}`),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    }));

    const eventPages: MetadataRoute.Sitemap = events.map((e) => ({
      url: absoluteUrl(`/evenements/${e.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [...staticPages, ...formationPages, ...articlePages, ...eventPages];
  } catch (error) {
    // Base indisponible : on sert au moins les pages statiques.
    console.error("sitemap: contenu dynamique indisponible", error);
    return staticPages;
  }
}
