import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, CalendarDays } from "lucide-react";
import { getBlogArticleBySlug, getBlogArticles, getFormations } from "@/lib/data-service";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { ShareBar } from "@/components/ShareBar";
import { NewsletterForm } from "@/components/NewsletterForm";
import { absoluteUrl } from "@/lib/site";
import { parseFrenchDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const all = await getBlogArticles();
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) return { title: "Article introuvable", robots: { index: false } };
  const publishedIso = parseFrenchDate(article.publishedAt);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/actualites/${article.slug}` },
    authors: [{ name: article.author.split(",")[0].trim() }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/actualites/${article.slug}`,
      section: article.category,
      authors: [article.author.split(",")[0].trim()],
      ...(publishedIso && { publishedTime: `${publishedIso}T08:00:00+01:00` }),
    },
  };
}

/**
 * Découpe le contenu brut en paragraphes. Les anciennes données contiennent
 * « ì » à la place de « À » (encodage défaillant) : on le corrige à l'affichage.
 */
function toParagraphs(content: string): string[] {
  return content
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim().replace(/^ì\s+/u, "À "))
    .filter(Boolean);
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) notFound();

  const [allArticles, formations] = await Promise.all([getBlogArticles(), getFormations()]);
  const others = allArticles.filter((a) => a.id !== article.id).slice(0, 3);
  const suggestedFormations = formations.filter((f) => f.isPopular).slice(0, 3);

  const paragraphs = toParagraphs(article.content);
  const wordCount = article.content.split(/\s+/).filter(Boolean).length;
  const publishedIso = parseFrenchDate(article.publishedAt);
  const url = absoluteUrl(`/actualites/${article.slug}`);

  return (
    <article className="bg-paper">
      <JsonLd
        data={[
          articleJsonLd({
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            coverImage: article.coverImage,
            author: article.author,
            category: article.category,
            publishedIso,
            wordCount,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Actualités", path: "/actualites" },
            { name: article.title, path: `/actualites/${article.slug}` },
          ]),
        ]}
      />

      {/* En-tête */}
      <header className="border-b border-ink">
        <div className="wrap pt-8 lg:pt-12">
          <Link href="/actualites" className="arrow-link text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> Toutes les actualités
          </Link>
          <div className="mt-8 grid gap-10 pb-12 lg:grid-cols-12 lg:pb-16">
            <div className="lg:col-span-9">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">
                <span className="text-brand-700">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <time dateTime={publishedIso}>{article.publishedAt}</time>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {article.readTime}
                </span>
              </p>
              <h1 className="display-lg mt-6 text-ink">{article.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/70">{article.excerpt}</p>
            </div>
            <div className="flex flex-col justify-end gap-4 lg:col-span-3 lg:items-end lg:text-right">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Par</p>
                <p className="mt-1 font-display text-base font-bold text-ink">{article.author}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[21/9] max-h-[560px] w-full overflow-hidden border-t border-ink bg-ink">
          <Image src={article.coverImage} alt={article.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      </header>

      {/* Corps */}
      <div className="wrap grid gap-16 py-16 lg:grid-cols-12 lg:py-24">
        <div className="min-w-0 lg:col-span-7 lg:col-start-2">
          <div className="prose-editorial">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "dropcap" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">Partager cet article</p>
            <ShareBar url={url} title={article.title} text={`${article.title} — FuturCraft Institut`} />
          </div>
        </div>

        <aside className="min-w-0 lg:col-span-3 lg:col-start-10">
          <div className="space-y-6 lg:sticky lg:top-40">
            <div className="border border-ink bg-ink p-6 text-paper">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">Passer à l&apos;action</p>
              <p className="display-sm mt-3">Se former, concrètement.</p>
              <ul className="mt-5 divide-y divide-paper/15 border-y border-paper/15">
                {suggestedFormations.map((f) => (
                  <li key={f.id}>
                    <Link href={`/formation/${f.slug}`} className="group flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="font-semibold group-hover:text-accent-400">{f.title}</span>
                      <span className="shrink-0 text-xs text-paper/55">{f.duration.split(" (")[0]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/formations" className="arrow-link mt-5 text-accent-400">
                Voir les 12 formations <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border border-ink bg-accent-500 p-6 text-ink">
              <p className="display-sm">Une question ?</p>
              <p className="mt-2 text-sm leading-6 text-ink/75">Un conseiller d&apos;orientation vous répond sous 24 h.</p>
              <Link href="/contact" className="arrow-link mt-4 text-ink">
                Nous écrire <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* À lire aussi */}
      {others.length > 0 && (
        <section className="border-t border-ink bg-paper-100">
          <div className="wrap py-16 lg:py-20">
            <div className="flex items-end justify-between gap-6">
              <p className="eyebrow text-brand-700">À lire aussi</p>
              <Link href="/actualites" className="arrow-link text-xs uppercase tracking-[0.14em] text-ink">
                Toutes les actualités <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid-lines mt-8 grid md:grid-cols-3">
              {others.map((a) => (
                <Link key={a.id} href={`/actualites/${a.slug}`} className="group flex flex-col bg-paper">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                    <Image
                      src={a.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="tag tag-paper absolute left-4 top-4">{a.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50">{a.publishedAt}</p>
                    <h3 className="display-sm mt-3 text-ink group-hover:text-brand-700">{a.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
            <NewsletterForm source={`article:${article.slug}`} />
          </div>
        </div>
      </section>
    </article>
  );
}
