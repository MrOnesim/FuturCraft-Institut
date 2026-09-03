import { getFormationBySlug, getFormations, getPromotions, getProjects } from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, ArrowLeft, Clock, GraduationCap, MapPin, Calendar, ShieldCheck, Flame } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd, breadcrumbJsonLd, courseJsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  const all = await getFormations();
  return all.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const formation = await getFormationBySlug(slug);
  if (!formation) return { title: "Formation introuvable", robots: { index: false } };
  const description =
    formation.shortDescription ||
    `Formation ${formation.title} proposée par FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14 (Bénin).`;
  return {
    title: `${formation.title} — Formation`,
    description,
    alternates: { canonical: `/formation/${formation.slug}` },
    openGraph: {
      type: "website",
      title: `${formation.title} | Formation FuturCraft Institut`,
      description,
      url: `/formation/${formation.slug}`,
    },
  };
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

export default async function FormationDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const formation = await getFormationBySlug(slug);
  if (!formation) notFound();

  const [promotions, projects, allFormations] = await Promise.all([
    getPromotions(formation.id),
    getProjects(),
    getFormations(),
  ]);

  const relatedProjects = projects.filter((p) =>
    p.formationTitle.toLowerCase().includes(formation.title.slice(0, 10).toLowerCase())
  );
  const otherFormations = allFormations.filter((f) => f.id !== formation.id).slice(0, 3);

  const modules = JSON.parse(formation.modules || "[]") as {
    moduleNumber: string;
    title: string;
    description: string;
    duration: string;
  }[];
  const competencies = JSON.parse(formation.competencies || "[]") as string[];
  const tools = JSON.parse(formation.tools || "[]") as string[];
  const jobs = JSON.parse(formation.jobs || "[]") as string[];

  const faqs = [
    {
      q: "Quels sont les prérequis pour intégrer cette formation ?",
      a: `Le niveau recommandé est ${formation.level}. La motivation, la rigueur et la régularité dans la pratique sont les critères d'admission les plus déterminants.`,
    },
    {
      q: "Comment s'organisent les paiements des frais de formation ?",
      a: `Les frais s'élèvent à ${formatPrice(formation.price)} FCFA. Vous pouvez payer en plusieurs mensualités (jusqu'à ${formation.installmentsCount} fois) par MTN MoMo, Moov Money, carte bancaire ou directement à la caisse du campus.`,
    },
    {
      q: "Obtient-on une attestation ou certification reconnue ?",
      a: "Oui. À l'issue de la formation et après validation de la soutenance du projet devant un jury professionnel, vous recevez le Certificat Professionnel de Compétences FuturCraft, vérifiable numériquement par QR code.",
    },
    {
      q: "Les cours ont-ils lieu en présentiel ou en ligne ?",
      a: `Cette formation est dispensée en mode ${formation.mode} sur notre campus de ${formation.campus}. Les ateliers pratiques se font en laboratoire équipé.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const nav = [
    ["#presentation", "Présentation"],
    ["#programme", "Programme"],
    ["#competences", "Compétences"],
    ["#debouches", "Débouchés"],
    ["#faq", "FAQ"],
  ];

  return (
    <div className="bg-paper">
      <JsonLd
        data={[
          courseJsonLd({
            slug: formation.slug,
            title: formation.title,
            shortDescription: formation.shortDescription,
            category: formation.category,
            duration: formation.duration,
            level: formation.level,
            price: formation.price,
            mode: formation.mode,
            campus: formation.campus,
            imageUrl: formation.imageUrl,
            competencies,
            jobs,
            sessions: promotions.map((p) => ({ name: p.name, startDate: p.startDate, endDate: p.endDate })),
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Formations", path: "/formations" },
            { name: formation.title, path: `/formation/${formation.slug}` },
          ]),
          faqJsonLd,
        ]}
      />
      {/* En-tête */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap pt-8 lg:pt-12">
          <Link href="/formations" className="arrow-link text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> Toutes les formations
          </Link>
          <div className="mt-8 grid gap-10 pb-12 lg:grid-cols-12 lg:pb-16">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-solid">{formation.category}</span>
                {formation.isPopular && (
                  <span className="tag tag-accent">
                    <Flame className="h-3 w-3" /> Populaire
                  </span>
                )}
              </div>
              <h1 className="display-lg mt-6 text-ink">{formation.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">{formation.shortDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/inscription?formationId=${formation.id}`} className="btn btn-ink btn-lg">
                  Candidater à cette formation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href="#programme" className="btn btn-outline btn-lg">
                  Voir le programme
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px border border-ink bg-ink lg:col-span-4">
              {[
                { icon: Clock, k: "Durée", v: formation.duration.split(" (")[0] },
                { icon: GraduationCap, k: "Niveau requis", v: formation.level.split(" (")[0] },
                { icon: MapPin, k: "Campus", v: formation.campus },
                { icon: Calendar, k: "Modalité", v: formation.mode },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="bg-paper p-5">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                    <Icon className="h-3.5 w-3.5 text-brand-700" /> {k}
                  </dt>
                  <dd className="mt-2 font-display text-base font-bold leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Image bandeau */}
        <div className="relative aspect-[21/9] w-full overflow-hidden border-t border-ink bg-ink max-h-[520px]">
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Sous-navigation collante */}
      <div className="sticky top-[72px] z-30 border-b border-ink bg-paper/95 backdrop-blur-md lg:top-[116px]">
        <div className="wrap flex items-center gap-6 overflow-x-auto py-3 text-xs font-bold uppercase tracking-[0.14em] scrollbar-none">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="link-underline shrink-0 py-1 text-ink/70 hover:text-ink">
              {label}
            </a>
          ))}
          <span className="ml-auto hidden shrink-0 font-display text-base font-bold normal-case tracking-tight text-ink sm:block">
            {formatPrice(formation.price)} FCFA
          </span>
        </div>
      </div>

      <div className="wrap grid gap-16 py-16 lg:grid-cols-12 lg:py-24">
        {/* Colonne principale */}
        <div className="space-y-24 lg:col-span-8">
          {/* Présentation */}
          <section id="presentation" className="scroll-mt-40">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">01</span>
              <span className="text-ink/30">/</span>
              Présentation
            </p>
            <h2 className="display-md mt-5 text-ink">À propos de la formation</h2>
            <div className="prose-editorial dropcap mt-8 whitespace-pre-line">{formation.fullDescription}</div>
          </section>

          {/* Programme */}
          <section id="programme" className="scroll-mt-40">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-brand-700">
                  <span className="tabular-nums">02</span>
                  <span className="text-ink/30">/</span>
                  Programme
                </p>
                <h2 className="display-md mt-5 text-ink">Ce que vous allez apprendre</h2>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">{modules.length} modules</p>
            </div>
            <ol className="mt-10 border-t-2 border-ink">
              {modules.map((m, idx) => (
                <li key={idx} className="grid gap-3 border-b border-ink py-6 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-2">
                    <p className="numeral text-3xl text-ink/25">{String(idx + 1).padStart(2, "0")}</p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">{m.moduleNumber}</p>
                  </div>
                  <div className="sm:col-span-8">
                    <h3 className="display-sm text-ink">{m.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-ink/65">{m.description}</p>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs font-semibold text-ink/55 sm:col-span-2 sm:justify-end">
                    <Clock className="mt-0.5 h-3.5 w-3.5" /> {m.duration}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Compétences + outils */}
          <section id="competences" className="scroll-mt-40">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">03</span>
              <span className="text-ink/30">/</span>
              Compétences & outils
            </p>
            <h2 className="display-md mt-5 text-ink">Ce que vous saurez faire</h2>
            <ul className="grid-lines mt-10 grid sm:grid-cols-2">
              {competencies.map((c, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-paper p-5">
                  <span className="numeral mt-0.5 text-lg text-brand-700">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium leading-6 text-ink">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Environnement technique</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tools.map((t, idx) => (
                <span key={idx} className="tag border-ink text-ink">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* Débouchés */}
          <section id="debouches" className="scroll-mt-40">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">04</span>
              <span className="text-ink/30">/</span>
              Débouchés
            </p>
            <h2 className="display-md mt-5 text-ink">Métiers accessibles</h2>
            <ul className="mt-10 border-t-2 border-ink">
              {jobs.map((j, idx) => (
                <li key={idx} className="flex items-center justify-between gap-4 border-b border-ink py-4">
                  <span className="font-display text-lg font-bold text-ink sm:text-xl">{j}</span>
                  <span className="numeral text-sm text-ink/30">{String(idx + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Projets liés */}
          {relatedProjects.length > 0 && (
            <section>
              <p className="eyebrow text-brand-700">Réalisations</p>
              <h2 className="display-md mt-5 text-ink">Projets développés dans cette filière</h2>
              <div className="grid-lines mt-10 grid sm:grid-cols-2">
                {relatedProjects.map((proj) => (
                  <Link key={proj.id} href="/projets-etudiants" className="group flex flex-col bg-paper">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                      <Image
                        src={proj.coverImage}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="display-sm text-ink group-hover:text-brand-700">{proj.title}</h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">{proj.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section id="faq" className="scroll-mt-40">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">05</span>
              <span className="text-ink/30">/</span>
              Questions fréquentes
            </p>
            <h2 className="display-md mt-5 text-ink">Tout savoir sur cette formation</h2>
            <div className="mt-10">
              <FAQAccordion faqs={faqs} />
            </div>
          </section>
        </div>

        {/* Colonne latérale */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-44">
            <div className="border border-ink bg-paper hard-shadow">
              <div className="border-b border-ink bg-ink p-6 text-paper">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">Coût global</p>
                <p className="numeral mt-3 text-5xl">
                  {formatPrice(formation.price)} <span className="font-display text-lg font-bold tracking-normal text-paper/70">FCFA</span>
                </p>
                <p className="mt-3 text-xs text-paper/65">
                  Frais de dossier : {formatPrice(formation.registrationFee)} FCFA · paiement jusqu&apos;en {formation.installmentsCount} fois
                </p>
              </div>
              <div className="p-6">
                {promotions.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Sessions</p>
                    <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                      {promotions.map((p) => (
                        <li key={p.id} className="py-3">
                          <p className="text-sm font-bold text-ink">{p.name}</p>
                          <p className="mt-0.5 text-xs text-ink/55">
                            Début : {p.startDate} · {p.campus}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link href={`/inscription?formationId=${formation.id}`} className="btn btn-ink w-full">
                  Candidater
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <ul className="mt-6 space-y-2.5 text-xs text-ink/70">
                  {[
                    `Paiement échelonné jusqu'à ${formation.installmentsCount} fois`,
                    "Accompagnement insertion professionnelle",
                    "Certificat, reçus et attestation vérifiables",
                  ].map((g) => (
                    <li key={g} className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-ink bg-accent-500 p-6 text-ink">
              <p className="display-sm">Une question sur cette filière ?</p>
              <p className="mt-2 text-sm leading-6 text-ink/75">
                Échangez avec un conseiller d&apos;orientation sur WhatsApp, réponse sous quelques heures.
              </p>
              <a
                href="https://wa.me/22943327832"
                target="_blank"
                rel="noreferrer"
                className="arrow-link mt-4 text-ink"
              >
                +229 43 32 78 32 <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Autres formations */}
      <section className="border-t border-ink bg-paper-100">
        <div className="wrap py-16 lg:py-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display-md text-ink">Explorer d&apos;autres filières</h2>
            <Link href="/formations" className="arrow-link shrink-0 text-ink">
              Tout le catalogue <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="mt-10 border-t-2 border-ink">
            {otherFormations.map((f) => (
              <li key={f.id} className="border-b border-ink">
                <Link
                  href={`/formation/${f.slug}`}
                  className="group flex items-center justify-between gap-6 py-5 transition-colors hover:bg-ink hover:text-paper"
                >
                  <div className="px-1 sm:px-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 group-hover:text-accent-400">
                      {f.category}
                    </p>
                    <p className="display-sm mt-1">{f.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-6 px-1 sm:px-2">
                    <span className="hidden text-sm font-semibold sm:block">{f.duration.split(" (")[0]}</span>
                    <span className="flex h-11 w-11 items-center justify-center border border-ink transition-colors group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-ink bg-brand-700 text-paper">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <h2 className="display-md max-w-3xl">
            Prêt·e à rejoindre la prochaine promotion{" "}
            <span className="serif-accent font-normal text-accent-400">{formation.title} ?</span>
          </h2>
          <Link href={`/inscription?formationId=${formation.id}`} className="btn btn-accent btn-lg shrink-0">
            Je candidate maintenant
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
