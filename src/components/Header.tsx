"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Code2,
  Cpu,
  Palette,
  Camera,
  TrendingUp,
  Wind,
  Pen,
  Phone,
} from "lucide-react";

const formations = [
  { label: "Développement Web Fullstack", meta: "9 mois", href: "/formation/developpement-web-fullstack", icon: Code2 },
  { label: "Intelligence Artificielle", meta: "8 mois", href: "/formation/developpement-intelligence-artificielle", icon: Cpu },
  { label: "Web Design UI/UX", meta: "6 mois", href: "/formation/web-design-ui-ux", icon: Palette },
  { label: "Pilotage de Drone", meta: "3 mois", href: "/formation/pilotage-de-drone", icon: Wind },
  { label: "Marketing Digital", meta: "5 mois", href: "/formation/marketing-digital", icon: TrendingUp },
  { label: "Graphisme & Sérigraphie", meta: "6 mois", href: "/formation/graphisme-et-serigraphie", icon: Pen },
  { label: "Audiovisuel & Montage", meta: "6 mois", href: "/formation/photographie-cadrage-et-montage-video", icon: Camera },
];

const navLinks = [
  { label: "Formations", href: "/formations", hasMega: true },
  { label: "Admissions", href: "/admissions" },
  { label: "L'Institut", href: "/institut" },
  { label: "Vie du campus", href: "/vie-a-futurcraft" },
  { label: "Projets", href: "/projets-etudiants" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setMobileOpen(false);
      setMegaOpen(false);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname.startsWith(href)) ||
    (href === "/formations" && pathname.startsWith("/formation/"));

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-ink bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_0_rgba(11,15,26,0.08),0_12px_30px_-20px_rgba(11,15,26,0.4)]" : ""
        }`}
      >
        {/* Barre d'information */}
        <div className="hidden border-b border-ink/10 bg-ink text-paper lg:block">
          <div className="wrap flex h-9 items-center justify-between text-[11px] font-medium tracking-wide">
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-accent-500" />
              Admissions 2026 ouvertes — Campus de Godomey, Cotonou
            </p>
            <div className="flex items-center gap-6">
              <a href="tel:+22943327832" className="flex items-center gap-1.5 hover:text-accent-400">
                <Phone className="h-3 w-3" />
                +229 43 32 78 32
              </a>
              <Link href="/recu" className="hover:text-accent-400">
                Vérifier un reçu
              </Link>
              <Link href="/espace-etudiant" className="hover:text-accent-400">
                Espace étudiant
              </Link>
            </div>
          </div>
        </div>

        {/* Barre principale */}
        <div className="wrap flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="FuturCraft Institut — Accueil">
            <Image
              src="/images/Logo-crop.png"
              alt=""
              width={507}
              height={340}
              priority
              className="h-9 w-auto object-contain lg:h-10"
            />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[1.3rem] font-extrabold tracking-tight text-ink">
                FuturCraft
              </span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-700">
                Institut
              </span>
            </span>
          </Link>

          {/* Navigation bureau */}
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigation principale">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              if (link.hasMega) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`link-underline flex items-center gap-1 py-2 text-[13.5px] font-semibold ${
                        active ? "text-brand-700" : "text-ink"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                      />
                    </Link>

                    <div
                      className={`absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-4 transition-all duration-200 ${
                        megaOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-[1fr_220px] border border-ink bg-paper hard-shadow">
                        <div className="p-3">
                          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                            Filières phares
                          </p>
                          <ul>
                            {formations.map(({ label, href, icon: Icon, meta }, i) => (
                              <li key={href}>
                                <Link
                                  href={href}
                                  className="group/item flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper"
                                >
                                  <span className="w-5 text-[10px] font-bold tabular-nums text-ink/40 group-hover/item:text-accent-400">
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <Icon className="h-4 w-4 text-brand-700 group-hover/item:text-accent-400" />
                                  <span className="flex-1 text-sm font-semibold">{label}</span>
                                  <span className="text-[11px] text-ink/50 group-hover/item:text-paper/60">{meta}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          href="/formations"
                          className="group/all flex flex-col justify-between border-l border-ink bg-brand-700 p-5 text-paper transition-colors hover:bg-ink"
                        >
                          <div>
                            <p className="numeral text-5xl">12</p>
                            <p className="mt-2 text-sm font-semibold leading-snug">
                              formations professionnalisantes, de 1 à 9 mois.
                            </p>
                          </div>
                          <span className="arrow-link text-accent-400">
                            Tout le catalogue
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-underline py-2 text-[13.5px] font-semibold ${
                    active ? "text-brand-700" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions bureau */}
          <div className="hidden items-center gap-3 xl:flex">
            <Link href="/espace-etudiant" className="link-underline text-[13.5px] font-semibold text-ink">
              Mon espace
            </Link>
            <Link href="/inscription" className="btn btn-ink">
              Candidater
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Actions mobile */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link href="/inscription" className="btn btn-ink btn-sm hidden sm:inline-flex">
              Candidater
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center border border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        className={`fixed inset-0 z-40 bg-ink text-paper transition-all duration-300 xl:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto pt-[72px]">
          <nav className="wrap flex-1 py-8" aria-label="Navigation mobile">
            <ul className="divide-y divide-paper/10 border-y border-paper/10">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-4 transition-colors ${
                      isActive(link.href) ? "text-accent-400" : "text-paper hover:text-accent-400"
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-[11px] font-bold tabular-nums text-paper/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-3xl font-bold tracking-tight">{link.label}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-paper/40" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/inscription" onClick={() => setMobileOpen(false)} className="btn btn-accent btn-lg">
                Candidater maintenant
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/espace-etudiant" onClick={() => setMobileOpen(false)} className="btn btn-outline-light btn-lg">
                Mon espace étudiant
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/60">
              <a href="tel:+22943327832" className="flex items-center gap-2 hover:text-accent-400">
                <Phone className="h-3.5 w-3.5" /> +229 43 32 78 32
              </a>
              <div className="flex items-center gap-5">
                <Link href="/recu" onClick={() => setMobileOpen(false)} className="hover:text-accent-400">
                  Vérifier un reçu
                </Link>
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="hover:text-accent-400">
                  Administration
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
