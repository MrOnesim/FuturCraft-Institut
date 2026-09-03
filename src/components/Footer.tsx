import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

const formationLinks = [
  { label: "Développement Web Fullstack", href: "/formation/developpement-web-fullstack" },
  { label: "Intelligence Artificielle", href: "/formation/developpement-intelligence-artificielle" },
  { label: "Maîtrise des outils IA", href: "/formation/maitrise-outils-intelligence-artificielle" },
  { label: "Web Design UI/UX", href: "/formation/web-design-ui-ux" },
  { label: "Pilotage de Drone", href: "/formation/pilotage-de-drone" },
  { label: "Graphisme & Sérigraphie", href: "/formation/graphisme-et-serigraphie" },
  { label: "Marketing Digital", href: "/formation/marketing-digital" },
  { label: "Audiovisuel & Montage", href: "/formation/photographie-cadrage-et-montage-video" },
];

const instituteLinks = [
  { label: "Admissions & tarifs", href: "/admissions" },
  { label: "Candidater en ligne", href: "/inscription" },
  { label: "L'Institut", href: "/institut" },
  { label: "Vie du campus", href: "/vie-a-futurcraft" },
  { label: "Projets étudiants", href: "/projets-etudiants" },
  { label: "Espace entreprises", href: "/entreprises" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

const platformLinks = [
  { label: "Espace étudiant", href: "/espace-etudiant" },
  { label: "Vérifier un reçu", href: "/recu" },
  { label: "Administration", href: "/admin" },
];

const socials = [
  { name: "Facebook", url: "https://facebook.com/futurcraftinstitue" },
  { name: "Instagram", url: "https://instagram.com/futurcraft_institut" },
  { name: "LinkedIn", url: "https://linkedin.com/company/futurcraft-institut" },
  { name: "TikTok", url: "https://tiktok.com/@futurcraft_institut" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      {/* Bandeau d'appel */}
      <div className="border-b border-paper/10">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-24">
          <div>
            <p className="eyebrow text-accent-400">Rentrée 2026</p>
            <h2 className="display-lg mt-5 text-paper">
              Prêt·e à <span className="serif-accent font-normal text-accent-400">construire</span>
              <br />
              la suite ?
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <Link href="/inscription" className="btn btn-accent btn-lg">
              Candidater
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn btn-outline-light btn-lg">
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </div>

      {/* Colonnes */}
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center bg-paper p-1.5">
              <Image
                src="/images/Logo-crop.png"
                alt="Logo FuturCraft Institut"
                width={507}
                height={340}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="leading-none">
              <p className="font-display text-2xl font-extrabold tracking-tight">FuturCraft</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-400">Institut</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-paper/60">
            Institut de formation pratique aux métiers du numérique. 80 % de pratique, des projets réels et un
            accompagnement vers l&apos;emploi, à Cotonou et pour toute l&apos;Afrique de l&apos;Ouest.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-paper/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              <span>Godomey, Supermarché O Bénin, avant PK14 — Cotonou, Bénin</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              <span>
                <a href="tel:+22943327832" className="hover:text-accent-400">+229 43 32 78 32</a>
                <span className="text-paper/40"> · </span>
                <a href="tel:+2290197303050" className="hover:text-accent-400">+229 01 97 30 30 50</a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
              <span>
                <a href="mailto:contact@futurcraftinstitut.com" className="hover:text-accent-400">
                  contact@futurcraftinstitut.com
                </a>
              </span>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-paper/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-paper/70 transition-colors hover:border-accent-400 hover:text-accent-400"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-3 lg:pl-12">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-paper/50">Formations</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {formationLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/80 transition-colors hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/formations" className="arrow-link mt-1 text-accent-400">
                  Voir les 12 formations <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-paper/50">L&apos;Institut</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {instituteLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/80 transition-colors hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-paper/50">Plateformes</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/80 transition-colors hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-paper/50">Paiement</h4>
            <p className="mt-4 text-sm leading-6 text-paper/60">
              MTN MoMo · Moov Money · Carte bancaire · Espèces à la caisse du campus
            </p>
          </div>
        </div>
      </div>

      {/* Signature typographique */}
      <div className="overflow-hidden border-t border-paper/10">
        <p
          aria-hidden
          className="wrap select-none whitespace-nowrap py-4 font-display text-[clamp(3.5rem,13vw,13rem)] font-extrabold leading-none tracking-[-0.05em] text-paper/[0.06]"
        >
          FuturCraft Institut
        </p>
      </div>

      <div className="border-t border-paper/10">
        <div className="wrap flex flex-col gap-3 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FuturCraft Institut — Tous droits réservés. Enregistré en République du Bénin.</p>
          <div className="flex items-center gap-6">
            <Link href="/institut" className="hover:text-paper">À propos</Link>
            <Link href="/admissions" className="hover:text-paper">Conditions d&apos;inscription</Link>
            <Link href="/contact" className="hover:text-paper">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
