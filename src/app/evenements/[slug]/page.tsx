import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { getEventBySlug, getEvents } from "@/lib/data-service";
import { JsonLd, breadcrumbJsonLd, eventJsonLd } from "@/components/JsonLd";
import { ShareBar } from "@/components/ShareBar";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { absoluteUrl, whatsappUrl } from "@/lib/site";
import { isPastIso, parseFrenchDateRange } from "@/lib/dates";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const all = await getEvents();
  return all.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Événement introuvable", robots: { index: false } };
  const description = `${event.date} · ${event.location}. ${event.description}`;
  return {
    title: event.title,
    description,
    alternates: { canonical: `/evenements/${event.slug}` },
    openGraph: {
      type: "website",
      title: `${event.title} | FuturCraft Institut`,
      description,
      url: `/evenements/${event.slug}`,
    },
  };
}

const programmes: Record<string, { time: string; label: string }[]> = {
  Hackathon: [
    { time: "Jour 1 — 09h00", label: "Accueil, formation des équipes et présentation des défis" },
    { time: "Jour 1 — 14h00", label: "Ateliers express : APIs d'IA, données ouvertes, prototypage" },
    { time: "Jour 2", label: "Développement en continu avec mentors et entreprises partenaires" },
    { time: "Jour 3 — 15h00", label: "Pitchs finaux devant le jury et remise des prix" },
  ],
  Masterclass: [
    { time: "09h00", label: "Accueil et briefing sécurité / réglementation du vol" },
    { time: "09h30", label: "Démonstration d'acquisition photogrammétrique en extérieur" },
    { time: "11h00", label: "Traitement des données et reconstruction 3D en salle" },
    { time: "12h30", label: "Questions-réponses et échanges avec les formateurs" },
  ],
  "Portes Ouvertes": [
    { time: "09h00", label: "Visite guidée des salles, du studio et du laboratoire" },
    { time: "10h00", label: "Présentation des 12 formations et des modalités de paiement" },
    { time: "11h30", label: "Job dating avec les entreprises partenaires" },
    { time: "13h00", label: "Entretiens d'orientation individuels (sur inscription)" },
  ],
};

export default async function EventPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const all = await getEvents();
  const others = all.filter((e) => e.id !== event.id).slice(0, 2);
  const { start, end } = parseFrenchDateRange(event.date);
  const past = isPastIso(end ?? start);
  const url = absoluteUrl(`/evenements/${event.slug}`);
  const programme = programmes[event.category] ?? [];

  return (
    <div className="bg-paper">
      <JsonLd
        data={[
          eventJsonLd({
            slug: event.slug,
            title: event.title,
            description: event.description,
            location: event.location,
            imageUrl: event.imageUrl,
            startIso: start,
            endIso: end,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Vie à FuturCraft", path: "/vie-a-futurcraft" },
            { name: event.title, path: `/evenements/${event.slug}` },
          ]),
        ]}
      />

      {/* En-tête */}
      <section className="border-b border-ink">
        <div className="wrap pt-8 lg:pt-12">
          <Link href="/vie-a-futurcraft" className="arrow-link text-xs uppercase tracking-[0.16em] text-ink/60 hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> Vie du campus & agenda
          </Link>
          <div className="mt-8 grid gap-10 pb-12 lg:grid-cols-12 lg:pb-16">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-solid">{event.category}</span>
                {past ? <span className="tag">Édition passée</span> : <span className="tag tag-accent">Inscriptions ouvertes</span>}
              </div>
              <h1 className="display-lg mt-6 text-ink">{event.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">{event.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#inscription" className="btn btn-ink btn-lg">
                  {past ? "Prochaine édition" : "Réserver ma place"}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={whatsappUrl(`Bonjour, je souhaite des informations sur « ${event.title} »`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  Question sur WhatsApp
                </a>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-px border border-ink bg-ink sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
              {[
                { icon: CalendarDays, k: "Date", v: event.date },
                { icon: MapPin, k: "Lieu", v: event.location },
                { icon: Users, k: "Participants", v: `${event.attendeesCount ?? 0} inscrits` },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="bg-paper p-5">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                    <Icon className="h-3.5 w-3.5 text-brand-700" /> {k}
                  </dt>
                  <dd className="mt-2 font-display text-base font-bold leading-snug text-ink">
                    {k === "Date" && start ? <time dateTime={start}>{v}</time> : v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="relative aspect-[21/9] max-h-[520px] w-full overflow-hidden border-t border-ink bg-ink">
          <Image src={event.imageUrl} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      </section>

      <div className="wrap grid gap-16 py-16 lg:grid-cols-12 lg:py-24">
        {/* Colonne principale */}
        <div className="min-w-0 space-y-20 lg:col-span-7">
          <section>
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">01</span>
              <span className="text-ink/30">/</span>
              Au programme
            </p>
            <h2 className="display-md mt-5 text-ink">Ce qui vous attend</h2>
            <div className="prose-editorial mt-8">
              <p>{event.description}</p>
            </div>
            {programme.length > 0 && (
              <ol className="mt-8 border-t-2 border-ink">
                {programme.map((step, i) => (
                  <li key={i} className="grid gap-2 border-b border-ink py-5 sm:grid-cols-12 sm:gap-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700 sm:col-span-4">{step.time}</p>
                    <p className="text-sm leading-6 text-ink/80 sm:col-span-8">{step.label}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">02</span>
              <span className="text-ink/30">/</span>
              Infos pratiques
            </p>
            <h2 className="display-md mt-5 text-ink">Venir au campus</h2>
            <div className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2">
              <div className="bg-paper p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Adresse</p>
                <p className="mt-2 font-display text-base font-bold leading-snug text-ink">
                  Godomey, Supermarché O Bénin, avant PK14
                  <br />
                  Cotonou, Bénin
                </p>
              </div>
              <div className="bg-paper p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Participation</p>
                <p className="mt-2 font-display text-base font-bold leading-snug text-ink">Gratuite, sur inscription</p>
                <p className="mt-1 text-xs text-ink/60">Places limitées selon la capacité des salles.</p>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-4 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">Inviter quelqu&apos;un</p>
            <ShareBar url={url} title={event.title} text={`${event.title} — ${event.date} à FuturCraft Institut.`} />
          </div>
        </div>

        {/* Inscription */}
        <aside className="min-w-0 lg:col-span-5">
          <div id="inscription" className="scroll-mt-32 border border-ink bg-ink p-6 text-paper hard-shadow lg:sticky lg:top-40 lg:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400">
              {past ? "Édition passée" : "Inscription"}
            </p>
            <p className="display-sm mt-3">
              {past ? "Être prévenu·e de la prochaine édition." : "Réservez votre place en 30 secondes."}
            </p>
            <p className="mt-2 text-sm leading-6 text-paper/70">
              {past
                ? "Cet événement a déjà eu lieu. Laissez vos coordonnées : nous vous contacterons dès que la prochaine date est fixée."
                : "Confirmation par WhatsApp. Un email récapitulatif vous est aussi envoyé si vous renseignez votre adresse."}
            </p>
            <div className="mt-6">
              <EventRegistrationForm eventTitle={event.title} eventSlug={event.slug} past={past} />
            </div>
          </div>
        </aside>
      </div>

      {/* Autres événements */}
      {others.length > 0 && (
        <section className="border-t border-ink bg-paper-100">
          <div className="wrap py-16 lg:py-20">
            <div className="flex items-end justify-between gap-6">
              <p className="eyebrow text-brand-700">Autres rendez-vous</p>
              <Link href="/vie-a-futurcraft" className="arrow-link text-xs uppercase tracking-[0.14em] text-ink">
                Tout l&apos;agenda <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid-lines mt-8 grid md:grid-cols-2">
              {others.map((ev) => (
                <Link key={ev.id} href={`/evenements/${ev.slug}`} className="group grid bg-paper sm:grid-cols-5">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5 sm:col-span-2 sm:aspect-auto sm:border-b-0 sm:border-r">
                    <Image src={ev.imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-6 sm:col-span-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                      <CalendarDays className="h-3.5 w-3.5" /> {ev.date}
                    </p>
                    <h3 className="display-sm mt-3 text-ink group-hover:text-brand-700">{ev.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/65">{ev.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
