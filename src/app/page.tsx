import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Quote } from "lucide-react";
import { getFormations, getProjects } from "@/lib/data-service";
import { Reveal } from "@/components/Reveal";
import { StatCounter } from "@/components/StatCounter";
import { NewsletterForm } from "@/components/NewsletterForm";
import { RotatingBadge } from "@/components/RotatingBadge";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

const marqueeItems = [
  "Développement Web",
  "Intelligence Artificielle",
  "UI/UX Design",
  "Pilotage de Drone",
  "Marketing Digital",
  "Sérigraphie",
  "Audiovisuel",
  "Maintenance & Réseau",
  "E-commerce",
  "Copywriting",
];

const pillars = [
  {
    n: "01",
    title: "80 % de pratique",
    text: "Chaque module se termine par une réalisation concrète. Pas de diplôme sans projet fonctionnel, présenté devant un jury.",
  },
  {
    n: "02",
    title: "Des mentors en activité",
    text: "Développeurs, designers, marketeurs et télépilotes en poste, qui enseignent ce qu'ils font au quotidien.",
  },
  {
    n: "03",
    title: "Cohortes limitées",
    text: "Des promotions à taille humaine pour un suivi individuel, du premier jour jusqu'à l'insertion professionnelle.",
  },
  {
    n: "04",
    title: "Un réseau qui recrute",
    text: "Startups, agences et entreprises partenaires à Cotonou et Abomey-Calavi accueillent nos apprenants en stage et en emploi.",
  },
];

const testimonials = [
  {
    name: "Carmel DANGBEGNON",
    role: "Prompt Engineer",
    avatar: "/images/carmel.jpg",
    quote:
      "Grâce à FuturCraft Institut, ma sœur a pu acquérir des compétences concrètes et trouver un emploi rapidement. Les formateurs sont passionnés et toujours à l'écoute.",
  },
  {
    name: "William ZOMANHOUN",
    role: "Développeur web",
    avatar: "/images/wiliam.jpg",
    quote:
      "Les projets concrets m'ont permis de progresser rapidement et de prendre confiance. J'ai appris à travailler comme dans une véritable équipe produit.",
  },
  {
    name: "Carlos HOUESSINON",
    role: "Graphiste & UI/UX Designer",
    avatar: "/images/houessinon.jpg",
    quote:
      "Une formation accessible et exigeante, portée par des intervenants toujours disponibles. Chaque cours nous rapproche un peu plus du monde professionnel.",
  },
  {
    name: "Léa AHOUANSE",
    role: "Étudiante",
    avatar: "/images/Lea-Ahouanse.jpg",
    quote:
      "Une expérience immersive et encadrante. À FuturCraft, chaque module débouche sur une réalisation concrète qui renforce confiance et employabilité.",
  },
  {
    name: "Nicodème ATAKOUN",
    role: "Spécialiste Marketing digital",
    avatar: "/images/nicodem.jpg",
    quote:
      "J'ai trouvé à FuturCraft une communauté motivée et les outils nécessaires pour transformer mes idées en compétences et résultats concrets.",
  },
  {
    name: "Cédric Magloire AKOFODJI",
    role: "Consultant numérique",
    avatar: "/images/cedric.jpg",
    quote:
      "La force de l'institut est son approche par la pratique. On apprend, on teste et on construit avec des objectifs professionnels clairs dès le premier mois.",
  },
];

const steps = [
  { n: "01", title: "Choisis ta filière", text: "12 formations, de 1 à 9 mois. Un conseiller t'aide à trancher si tu hésites." },
  { n: "02", title: "Candidate en ligne", text: "5 minutes, depuis ton téléphone. Tu reçois ton numéro de dossier immédiatement." },
  { n: "03", title: "Réserve ta place", text: "25 000 FCFA de frais de dossier par MoMo, Moov Money, carte ou à la caisse." },
  { n: "04", title: "Rejoins ta promotion", text: "Reçu certifié, attestation, groupe de promo : tu démarres le jour J." },
];

export default async function HomePage() {
  const [formations, projects] = await Promise.all([getFormations(), getProjects()]);
  const featured = formations.slice(0, 6);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="overflow-x-clip">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative border-b border-ink bg-paper">
        <div className="wrap grid gap-10 pb-16 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-8">
            <p className="eyebrow animate-fade-up text-brand-700">
              Institut de formation aux métiers du numérique — Cotonou, Bénin
            </p>
            <h1 className="display-xl mt-8 animate-fade-up delay-100 text-ink">
              Apprends.
              <br />
              Crée.
              <br />
              <span className="serif-accent font-normal text-brand-700">Innove.</span>
            </h1>
          </div>

          <div className="flex flex-col justify-end lg:col-span-4">
            <p className="animate-fade-up delay-200 max-w-md text-lg leading-8 text-ink/70">
              Des formations courtes et intensives, 80 % de pratique, des mentors en activité — pour passer de
              l&apos;idée à l&apos;emploi.
            </p>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 delay-300">
              <Link href="/inscription" className="btn btn-ink btn-lg">
                Candidater
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/formations" className="btn btn-outline btn-lg">
                Voir les formations
              </Link>
            </div>
          </div>
        </div>

        {/* Bande image + chiffres */}
        <div className="wrap pb-0">
          <div className="grid border border-ink lg:grid-cols-12">
            <div className="relative aspect-[16/10] overflow-hidden bg-ink lg:col-span-7 lg:aspect-auto lg:min-h-[440px]">
              <Image
                src="/images/ange.jpg"
                alt="Étudiants en atelier sur le campus FuturCraft à Godomey"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2 lg:left-6 lg:top-6">
                <span className="tag tag-paper">Campus de Godomey</span>
              </div>
              <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6">
                <RotatingBadge tone="accent" />
              </div>
            </div>

            <div className="grid divide-y divide-ink border-ink sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:divide-y lg:border-l sm:divide-x sm:divide-y-0 lg:divide-x-0">
              <div className="flex flex-col justify-between p-6 lg:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Formations</p>
                <p className="numeral mt-6 text-6xl text-ink lg:text-7xl">
                  <StatCounter target={12} />
                </p>
                <p className="mt-3 text-sm text-ink/65">filières professionnalisantes</p>
              </div>
              <div className="flex flex-col justify-between bg-brand-700 p-6 text-paper lg:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-paper/60">Talents</p>
                <p className="numeral mt-6 text-6xl lg:text-7xl">
                  <StatCounter target={500} suffix="+" />
                </p>
                <p className="mt-3 text-sm text-paper/75">apprenants accompagnés</p>
              </div>
              <div className="flex flex-col justify-between bg-accent-500 p-6 text-ink lg:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">Pratique</p>
                <p className="numeral mt-6 text-6xl lg:text-7xl">
                  <StatCounter target={80} suffix="%" />
                </p>
                <p className="mt-3 text-sm text-ink/70">du temps en atelier et sur projet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="marquee mt-12 border-t border-ink bg-ink py-4 text-paper lg:mt-16">
          <div className="marquee-track" aria-hidden>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center font-display text-xl font-bold tracking-tight sm:text-2xl">
                <span className="px-8">{item}</span>
                <span className="h-2 w-2 rounded-full bg-accent-500" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── MANIFESTE ─────────────────────────── */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">01</span>
              <span className="text-ink/30">/</span>
              Pourquoi FuturCraft
            </p>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="display-md text-ink">
                Des milliers de diplômés, trop peu de profils opérationnels. Nous formons{" "}
                <span className="serif-accent font-normal text-brand-700">ceux qui savent faire</span> — et le
                prouvent, projet après projet.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-px border border-ink bg-ink sm:grid-cols-2">
              {pillars.map((p, i) => (
                <div key={p.n} className="bg-paper p-7 lg:p-9">
                  <Reveal delay={i * 80}>
                    <p className="numeral text-4xl text-brand-700/30">{p.n}</p>
                    <h3 className="display-sm mt-6 text-ink">{p.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/65">{p.text}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FORMATIONS ─────────────────────────── */}
      <section className="border-b border-ink bg-paper-100">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="02"
            eyebrow="Le catalogue"
            title={
              <>
                Douze façons d&apos;entrer
                <br className="hidden sm:block" /> dans le numérique.
              </>
            }
            description="Des parcours longs pour devenir développeur ou designer, des formats courts pour maîtriser un outil en un mois. Tous en présentiel à Godomey."
            action={
              <Link href="/formations" className="arrow-link text-ink">
                Tout le catalogue <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />

          <ol className="mt-14 border-t-2 border-ink">
            {featured.map((f, i) => (
              <li key={f.id} className="border-b border-ink">
                <Link
                  href={`/formation/${f.slug}`}
                  className="group grid items-center gap-4 py-6 transition-colors hover:bg-ink hover:text-paper sm:grid-cols-12 sm:gap-6 lg:py-7"
                >
                  <span className="numeral px-1 text-2xl text-ink/30 group-hover:text-accent-400 sm:col-span-1 sm:px-2 lg:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative hidden aspect-[4/3] overflow-hidden bg-ink/10 sm:col-span-2 sm:block lg:col-span-2">
                    <Image
                      src={f.imageUrl}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="px-1 sm:col-span-5 sm:px-2 lg:col-span-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 group-hover:text-accent-400">
                      {f.category}
                    </p>
                    <h3 className="display-sm mt-2">{f.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60 group-hover:text-paper/65 lg:hidden">
                      {f.shortDescription}
                    </p>
                  </div>
                  <div className="hidden text-sm text-ink/65 group-hover:text-paper/70 lg:col-span-2 lg:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/55 group-hover:text-paper/55">
                      Durée
                    </p>
                    <p className="mt-1 font-semibold">{f.duration.split(" (")[0]}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-1 sm:col-span-4 sm:px-2 lg:col-span-2 lg:justify-end">
                    <div className="lg:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/55 group-hover:text-paper/55">
                        Tarif
                      </p>
                      <p className="mt-1 font-display text-lg font-bold">{formatPrice(f.price)} FCFA</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-ink transition-colors group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <p className="text-sm text-ink/60">
              + {Math.max(formations.length - featured.length, 0)} autres formations : Webmaster, Maintenance & Réseau,
              Copywriting, E-commerce…
            </p>
            <Link href="/formations" className="btn btn-ink">
              Voir les {formations.length} formations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── MÉTHODE / IMAGE ─────────────────────────── */}
      <section className="border-b border-ink bg-ink text-paper">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[640px]">
            <Image
              src="/images/projet-vano-baby.jpg"
              alt="Salle de projet : un site livré par les étudiants affiché sur tous les postes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 lg:p-8">
              <span className="tag tag-accent">Projet de fin de module</span>
            </div>
          </div>
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
            <p className="eyebrow text-accent-400">
              <span className="tabular-nums">03</span>
              <span className="text-paper/30">/</span>
              La méthode
            </p>
            <h2 className="display-md mt-6">
              On n&apos;apprend pas à coder
              <br />
              en regardant.{" "}
              <span className="serif-accent font-normal text-accent-400">On livre.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-paper/65">
              Chaque semaine, un livrable. Chaque module, une soutenance. À la fin du parcours, un projet réel
              déployé en production et défendu devant un jury d&apos;entreprises partenaires — c&apos;est lui qui
              vous ouvre les portes, pas seulement le certificat.
            </p>
            <ul className="mt-10 divide-y divide-paper/15 border-y border-paper/15">
              {[
                ["Ateliers", "Salles informatiques climatisées, studio audiovisuel, lab drones & IA."],
                ["Rythme", "Cours du jour, du soir ou du samedi selon les formations."],
                ["Certification", "Certificat professionnel FuturCraft, reçu et attestation vérifiables par QR code."],
                ["Insertion", "Stages, offres partenaires et accompagnement jusqu'au premier poste."],
              ].map(([k, v]) => (
                <li key={k} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-400">{k}</span>
                  <span className="text-sm leading-6 text-paper/75">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link href="/institut" className="btn btn-paper">
                Découvrir l&apos;institut
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PROJETS ─────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="border-b border-ink bg-paper">
          <div className="wrap py-20 lg:py-28">
            <SectionHeading
              index="04"
              eyebrow="Réalisations"
              title={
                <>
                  Fait par nos étudiants,
                  <br className="hidden sm:block" /> utilisé pour de vrai.
                </>
              }
              action={
                <Link href="/projets-etudiants" className="arrow-link text-ink">
                  Tous les projets <ArrowUpRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-14 grid gap-px border border-ink bg-ink md:grid-cols-3">
              {featuredProjects.map((p, i) => {
                const tech = (JSON.parse(p.technologies || "[]") as string[]).slice(0, 3);
                return (
                  <article key={p.id} className="group flex flex-col bg-paper">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <Reveal delay={i * 90} className="flex flex-1 flex-col p-6 lg:p-7">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700">{p.formationTitle}</p>
                      <h3 className="display-sm mt-3 text-ink">{p.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{p.tagline}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                        {tech.map((t) => (
                          <span key={t} className="tag text-ink/70">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────── TÉMOIGNAGES ─────────────────────────── */}
      <section className="border-b border-ink bg-paper-100">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="05"
            eyebrow="Ils en parlent"
            title={
              <>
                La parole aux
                <span className="serif-accent font-normal text-brand-700"> apprenants.</span>
              </>
            }
          />
          <div className="mt-14 columns-1 gap-6 md:columns-2 xl:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 80}>
                <figure className="frame p-7">
                  <Quote className="h-6 w-6 text-accent-500" />
                  <blockquote className="mt-4 font-display text-lg font-medium leading-relaxed text-ink">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink/10">
                      <Image src={t.avatar} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{t.name}</span>
                      <span className="block text-xs text-ink/55">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── PARCOURS D'ADMISSION ─────────────────────────── */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="06"
            eyebrow="Admission"
            title="Quatre étapes, aucune paperasse."
            description="Le processus est entièrement digitalisé, du choix de la filière à la remise du reçu certifié."
            action={
              <Link href="/admissions" className="arrow-link text-ink">
                Modalités & tarifs <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-14 grid gap-px border border-ink bg-ink lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="bg-paper p-7 lg:p-8">
                <Reveal delay={i * 80} className="flex h-full flex-col lg:min-h-[236px]">
                  <p className="numeral text-6xl text-ink lg:text-7xl">{s.n}</p>
                  <h3 className="display-sm mt-auto pt-10 text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{s.text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA + BROCHURE ─────────────────────────── */}
      <section className="bg-brand-700 text-paper">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent-400">Prochaine rentrée</p>
            <h2 className="display-lg mt-6">
              Ta prochaine version
              <br />
              commence{" "}
              <span className="serif-accent font-normal text-accent-400">aujourd&apos;hui.</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/inscription" className="btn btn-accent btn-lg">
                Candidater maintenant
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/22943327832?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20les%20formations%20FuturCraft"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-light btn-lg"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-paper/60">Recevoir la brochure</p>
            <p className="mt-3 text-sm leading-7 text-paper/75">
              Programmes détaillés, calendrier des sessions et grille tarifaire complète, dans votre boîte mail.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
