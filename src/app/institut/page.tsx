import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "L'Institut | FuturCraft Institut Bénin",
  description:
    "Histoire, mission, vision, valeurs et équipe dirigeante de FuturCraft Institut, centre d'excellence numérique fondé par Gauthier I. ORE au Bénin.",
};

const values = [
  { n: "01", title: "Innovation", desc: "Explorer les technologies d'avant-garde — IA générative, drones, frameworks modernes — avant tout le monde." },
  { n: "02", title: "Créativité", desc: "Encourager la pensée originale, l'esprit d'initiative et l'art de concevoir des solutions africaines uniques." },
  { n: "03", title: "Excellence", desc: "Viser les standards internationaux de qualité de code, de rigueur d'ingénierie et de rendu professionnel." },
  { n: "04", title: "Pratique", desc: "80 % de temps de manipulation réelle. Aucun diplôme sans réalisation d'un projet fonctionnel." },
  { n: "05", title: "Collaboration", desc: "Le travail d'équipe en méthode agile, comme en entreprise, avec un mentorat bienveillant." },
  { n: "06", title: "Impact", desc: "Créer de la valeur concrète pour l'économie béninoise et le continent à travers la technologie." },
];

const team = [
  {
    name: "Herman HOUNKPE",
    role: "Formateur en Développement Web & Technologies Fullstack",
    image: "/images/Herman.jpg",
    bio: "Forme les futurs développeurs à maîtriser le développement web et les technologies fullstack, du code à la mise en production.",
  },
  {
    name: "Gauthier ORE",
    role: "Directeur des stages et emplois",
    image: "/images/gauthier.jpg",
    bio: "Connecte les talents de FuturCraft aux entreprises et startups pour traduire les compétences acquises en opportunités concrètes.",
  },
  {
    name: "Yoan DANSOU",
    role: "Co-fondateur & Prompt engineer",
    image: "/images/Yoan-DANSOU.jpg",
    bio: "Co-fondateur et expert en prompt engineering, il explore les usages avancés de l'IA générative pour former la prochaine génération.",
  },
  {
    name: "Hugues Mahugnon SEDAGONGJI",
    role: "Formateur en cadrage & montage",
    image: "/images/Mahugnon.jpg",
    bio: "Transmet les techniques de cadrage et de montage pour des productions vidéo à la hauteur des standards professionnels.",
  },
  {
    name: "Merveil SUSUNI",
    role: "Développeur web",
    image: "/images/Merveil.jpg",
    bio: "Intervient sur les projets web concrets et accompagne les étudiants dans la maîtrise des technologies du développement d'applications.",
  },
];

export default function InstitutPage() {
  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="L'Institut"
        title={
          <>
            Bâtir la prochaine génération
            <br />
            de <span className="serif-accent font-normal text-brand-700">talents numériques</span> africains.
          </>
        }
        description="« Nous ne formons pas simplement des étudiants. Nous aidons une génération à construire, créer et transformer son avenir. »"
      />

      {/* Image + histoire */}
      <section className="border-b border-ink">
        <div className="grid lg:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden border-b border-ink bg-ink lg:col-span-5 lg:aspect-auto lg:border-b-0 lg:border-r">
            <Image
              src="/images/houessinon.jpg"
              alt="Rencontre entre partenaires et direction sur le campus FuturCraft"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="px-5 py-16 sm:px-8 lg:col-span-7 lg:px-16 lg:py-24">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">01</span>
              <span className="text-ink/30">/</span>
              Notre histoire
            </p>
            <h2 className="display-md mt-5 text-ink">
              Combler le fossé entre diplômes et compétences réelles.
            </h2>
            <div className="prose-editorial dropcap mt-8">
              <p>
                FuturCraft Institut est né d&apos;un constat lucide sur le marché de l&apos;emploi en Afrique de
                l&apos;Ouest : des milliers de diplômés sortent chaque année d&apos;écoles supérieures avec des
                connaissances théoriques dépassées, tandis que les entreprises et startups peinent à recruter des
                développeurs opérationnels, des designers UI/UX ou des spécialistes en intelligence artificielle.
              </p>
              <p>
                Sous l&apos;impulsion de <strong>Gauthier I. ORE</strong>{" "}
                et d&apos;une équipe d&apos;ingénieurs et de pédagogues engagés, FuturCraft s&apos;est donné pour
                mission de proposer un modèle différent : 80 % de pratique en atelier, immersion en conditions
                d&apos;entreprise réelles, et mentorat continu par des professionnels en activité.
              </p>
            </div>

            <div className="mt-12 grid gap-px border border-ink bg-ink sm:grid-cols-2">
              <div className="bg-brand-700 p-7 text-paper">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">Mission</p>
                <p className="mt-4 font-display text-xl font-bold leading-snug">
                  Former des talents agiles, techniquement solides et dotés d&apos;un savoir-faire directement
                  valorisable sur le marché local et mondial du numérique.
                </p>
              </div>
              <div className="bg-accent-500 p-7 text-ink">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">Vision</p>
                <p className="mt-4 font-display text-xl font-bold leading-snug">
                  Faire du Bénin le hub d&apos;ingénierie et de créativité numérique le plus dynamique d&apos;Afrique
                  subsaharienne, capable d&apos;exporter des compétences d&apos;élite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="border-b border-ink bg-ink text-paper">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="02"
            eyebrow="Notre ADN"
            tone="dark"
            title={
              <>
                Six valeurs <span className="serif-accent font-normal text-accent-400">cardinales.</span>
              </>
            }
          />
          <div className="grid-lines-light mt-14 grid sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.n} className="bg-ink p-7 lg:p-9">
                <Reveal delay={(i % 3) * 80}>
                  <p className="numeral text-4xl text-accent-400/50">{v.n}</p>
                  <h3 className="display-sm mt-8 text-paper">{v.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-paper/65">{v.desc}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="03"
            eyebrow="Direction & pédagogie"
            title={
              <>
                L&apos;équipe <span className="serif-accent font-normal text-brand-700">FuturCraft.</span>
              </>
            }
            description="Des professionnels engagés au quotidien pour la réussite de chaque promotion."
          />
          <div className="grid-lines mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {team.map((m, i) => (
              <div key={m.name} className="group bg-paper">
                <div className="relative aspect-[4/5] overflow-hidden border-b border-ink bg-ink/5">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 20vw"
                    className="object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                  <span className="numeral absolute left-4 top-3 text-3xl text-paper drop-shadow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold leading-tight text-ink">{m.name}</h3>
                  <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">{m.role}</p>
                  <p className="mt-3 text-[13px] leading-6 text-ink/65">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus */}
      <section className="border-b border-ink bg-paper-100">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">04</span>
              <span className="text-ink/30">/</span>
              Infrastructures
            </p>
            <h2 className="display-md mt-5 text-ink">Le campus de Godomey.</h2>
            <p className="mt-5 text-base leading-7 text-ink/65">
              Un pôle entièrement dédié à la pratique : laboratoires connectés à la fibre, ateliers créatifs,
              espace de vol pour les drones et salles climatisées.
            </p>
            <address className="mt-8 flex items-start gap-3 border-t border-ink pt-6 not-italic">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="font-display text-lg font-bold text-ink">Campus FuturCraft Institut</p>
                <p className="mt-1 text-sm text-ink/65">Godomey, Supermarché O Bénin, avant PK14 — Cotonou, Bénin</p>
                <Link href="/contact" className="arrow-link mt-3 text-ink">
                  Venir nous voir <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </address>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden border border-ink bg-ink">
              <Image
                src="/images/projet-vano-baby.jpg"
                alt="Salle de projet du campus FuturCraft"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <ul className="mt-px grid gap-px border border-ink bg-ink sm:grid-cols-3">
              {[
                "Salles informatiques climatisées",
                "Studio audiovisuel & photo",
                "Lab drones & IA",
                "Ateliers sérigraphie",
                "Espace co-working",
                "Zone de vol extérieure",
              ].map((item) => (
                <li key={item} className="bg-paper px-5 py-4 text-sm font-semibold text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 text-paper">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <h2 className="display-md max-w-2xl">
            Rejoignez la prochaine <span className="serif-accent font-normal text-accent-400">promotion.</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/formations" className="btn btn-paper btn-lg">
              Voir les formations
            </Link>
            <Link href="/inscription" className="btn btn-accent btn-lg">
              Candidater
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
