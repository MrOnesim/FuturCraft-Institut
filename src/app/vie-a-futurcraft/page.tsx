import { getEvents } from "@/lib/data-service";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Vie à FuturCraft",
  description:
    "Découvrez l'ambiance, les hackathons, ateliers pratiques, sorties de promotion et moments de vie sur les campus de FuturCraft Institut.",
  alternates: { canonical: "/vie-a-futurcraft" },
  openGraph: {
    title: "Vie à FuturCraft | FuturCraft Institut",
    description:
      "Découvrez l'ambiance, les hackathons, ateliers pratiques, sorties de promotion et moments de vie sur les campus de FuturCraft Institut.",
    url: "/vie-a-futurcraft",
  },
};

const lifeMoments = [
  {
    title: "Sorties terrain & vol drone",
    desc: "Pratique en plein air à Ganvié, Ouidah et Calavi pour cartographier des parcelles et capturer des plans cinématiques.",
    image: "/images/Excution-Ganvie.jpg",
    tag: "Pratique terrain",
  },
  {
    title: "Ateliers Code & Pizza",
    desc: "Des sessions nocturnes de coding collaboratif pour débugger en équipe dans une ambiance festive et stimulante.",
    image: "/images/ange.jpg",
    tag: "Coding night",
  },
  {
    title: "Masterclasses & conférences tech",
    desc: "Interventions régulières d'ingénieurs internationaux, d'experts de Sèmè City et de fondateurs de startups béninoises.",
    image: "/images/houessinon.jpg",
    tag: "Masterclass",
  },
  {
    title: "Studio design & shootings",
    desc: "Prise en main des boîtiers, éclairages studio trois points, montage et conception d'identités de marque.",
    image: "/images/Montage-Video.jpg",
    tag: "Atelier créatif",
  },
];

export default async function ViePage() {
  const events = await getEvents();

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Immersion & communauté"
        title={
          <>
            Plus qu&apos;une école,
            <br />
            <span className="serif-accent font-normal text-brand-700">une communauté.</span>
          </>
        }
        description="Hackathons, sorties terrain, masterclasses et soirées de code : découvrez l'ambiance du campus et les moments qui font une promotion."
      />

      {/* Mosaïque photo */}
      <section className="border-b border-ink">
        <div className="grid grid-cols-2 gap-px bg-ink md:grid-cols-4">
          <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden bg-ink md:aspect-auto">
            <Image src="/images/Excution-Ganvie.jpg" alt="Sortie de promotion à Ganvié" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <span className="tag tag-paper absolute left-4 top-4">Sortie de promotion — Ganvié</span>
          </div>
          <div className="relative aspect-square overflow-hidden bg-ink">
            <Image src="/images/ange.jpg" alt="Atelier en salle" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-ink">
            <Image src="/images/projet-vano-baby.jpg" alt="Salle de projet" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden bg-ink">
            <Image src="/images/Montage-Video.jpg" alt="Atelier montage vidéo" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
          </div>
          <div className="flex aspect-square flex-col justify-between bg-brand-700 p-6 text-paper">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">Communauté</p>
            <div>
              <p className="numeral text-6xl lg:text-7xl">500+</p>
              <p className="mt-3 text-sm leading-6 text-paper/80">
                apprenants passés par le campus depuis l&apos;ouverture — et un réseau d&apos;alumni qui recrute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="01"
            eyebrow="Agenda officiel"
            title={
              <>
                Événements & hackathons
                <br className="hidden sm:block" />
                <span className="serif-accent font-normal text-brand-700">à venir.</span>
              </>
            }
          />
          <ol className="mt-14 border-t-2 border-ink">
            {events.map((ev, i) => (
              <li key={ev.id} className="grid gap-5 border-b border-ink py-7 md:grid-cols-12 md:items-center md:gap-8">
                <div className="md:col-span-2">
                  <p className="numeral text-3xl text-ink/25">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                    <CalendarDays className="h-3.5 w-3.5" /> {ev.date}
                  </p>
                </div>
                <Link href={`/evenements/${ev.slug}`} className="relative block aspect-[16/10] overflow-hidden border border-ink bg-ink/5 md:col-span-3" aria-label={`Voir l'événement ${ev.title}`}>
                  <Image src={ev.imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </Link>
                <div className="md:col-span-5">
                  <span className="tag text-ink/60">{ev.category}</span>
                  <h3 className="display-sm mt-3 text-ink">
                    <Link href={`/evenements/${ev.slug}`} className="hover:text-brand-700">
                      {ev.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{ev.description}</p>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm md:col-span-2 md:flex-col md:items-end">
                  <span className="flex items-center gap-1.5 text-ink/60">
                    <MapPin className="h-3.5 w-3.5" /> {ev.location}
                  </span>
                  <span className="font-display font-bold text-ink">{ev.attendeesCount} inscrits</span>
                  <Link href={`/evenements/${ev.slug}`} className="arrow-link text-xs uppercase tracking-[0.14em] text-ink">
                    S&apos;inscrire <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Temps forts */}
      <section className="border-b border-ink bg-paper-100">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="02"
            eyebrow="Magazine campus"
            title="Les temps forts de nos promotions."
          />
          <div className="mt-14 grid gap-px border border-ink bg-ink sm:grid-cols-2">
            {lifeMoments.map((m, i) => (
              <article key={m.title} className="group bg-paper">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="tag tag-paper absolute left-4 top-4">{m.tag}</span>
                  <span className="numeral absolute bottom-3 right-4 text-5xl text-paper drop-shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="display-sm text-ink">{m.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/65">{m.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div>
            <h2 className="display-md">
              Envie de vivre <span className="serif-accent font-normal text-accent-400">l&apos;expérience ?</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-paper/65">
              Participez à la prochaine journée portes ouvertes ou postulez directement en ligne pour rejoindre la
              prochaine cohorte.
            </p>
          </div>
          <Link href="/inscription" className="btn btn-accent btn-lg shrink-0">
            Rejoindre la promotion 2026
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
