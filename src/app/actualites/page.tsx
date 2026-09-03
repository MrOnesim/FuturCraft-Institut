import { getBlogArticles } from "@/lib/data-service";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { NewsletterForm } from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Actualités & Blog Tech",
  description:
    "Suivez les dernières tendances numériques, les conseils d'orientation et les événements de FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14.",
  alternates: { canonical: "/actualites" },
  openGraph: {
    title: "Actualités & Blog Tech | FuturCraft Institut",
    description:
      "Suivez les dernières tendances numériques, les conseils d'orientation et les événements de FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14.",
    url: "/actualites",
  },
};

export default async function ActualitesPage() {
  const articles = await getBlogArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Insights & médias"
        title={
          <>
            Le journal
            <br />
            <span className="serif-accent font-normal text-brand-700">FuturCraft.</span>
          </>
        }
        description="Analyses du marché de la tech en Afrique, conseils pour réussir son insertion professionnelle et retours sur nos promotions."
      />

      {articles.length === 0 ? (
        <section className="wrap py-20">
          <div className="border border-ink p-12 text-center">
            <p className="display-sm text-ink">Aucun article publié pour le moment.</p>
            <p className="mt-2 text-sm text-ink/60">Revenez bientôt, la rédaction prépare les prochains numéros.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Article à la une */}
          {lead && (
            <section className="border-b border-ink">
              <article className="grid lg:grid-cols-12">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[520px] lg:border-b-0 lg:border-r">
                  <Image
                    src={lead.coverImage}
                    alt={lead.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <span className="tag tag-accent absolute left-5 top-5">À la une</span>
                </div>
                <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:col-span-5 lg:px-12 lg:py-14">
                  <div>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">
                      <span className="text-brand-700">{lead.category}</span>
                      <span>·</span>
                      <span>{lead.publishedAt}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {lead.readTime}
                      </span>
                    </p>
                    <h2 className="display-md mt-5 text-ink">
                      <Link href={`/actualites/${lead.slug}`} className="hover:text-brand-700">
                        {lead.title}
                      </Link>
                    </h2>
                    <p className="mt-5 text-base leading-7 text-ink/65">{lead.excerpt}</p>
                  </div>
                  <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink pt-5">
                    <span className="text-sm font-semibold text-ink">{lead.author}</span>
                    <Link href={`/actualites/${lead.slug}`} className="arrow-link text-ink">
                      Lire l&apos;article <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* Liste */}
          {rest.length > 0 && (
            <section className="wrap py-16 lg:py-24">
              <div className="flex items-end justify-between gap-6">
                <p className="eyebrow text-brand-700">Derniers articles</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
                  {rest.length} article{rest.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid-lines mt-8 grid md:grid-cols-2 xl:grid-cols-3">
                {rest.map((art, i) => (
                  <Link key={art.id} href={`/actualites/${art.slug}`} className="group flex flex-col bg-paper">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                      <Image
                        src={art.coverImage}
                        alt={art.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="tag tag-paper absolute left-4 top-4">{art.category}</span>
                      <span className="numeral absolute bottom-3 right-4 text-5xl text-paper drop-shadow-md">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50">
                        <span>{art.publishedAt}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {art.readTime}
                        </span>
                      </p>
                      <h3 className="display-sm mt-3 text-ink group-hover:text-brand-700">{art.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{art.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
                        <span className="text-xs font-semibold text-ink/70">{art.author}</span>
                        <span className="arrow-link text-xs uppercase tracking-[0.14em] text-ink">
                          Lire <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="border-t border-ink bg-brand-700 text-paper">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent-400">Newsletter</p>
            <h2 className="display-md mt-5">
              Les tendances tech en Afrique,{" "}
              <span className="serif-accent font-normal text-accent-400">une fois par mois.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <NewsletterForm source="actualites" />
          </div>
        </div>
      </section>
    </div>
  );
}
