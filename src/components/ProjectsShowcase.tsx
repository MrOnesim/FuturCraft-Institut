"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Code2, X, ArrowUpRight } from "lucide-react";

interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  formationTitle: string;
  technologies: string;
  teamMembers: string;
  projectUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean | null;
}

type TeamMember = { name: string; role: string };

const avatarByTeamMember: Record<string, string> = {
  "Onesim Graça": "/images/Onesim-Graca.jpg",
};
const memberAvatar = (name: string) => avatarByTeamMember[name] || null;

const categories = ["Tous", "Web & Cloud", "Intelligence Artificielle", "Drone & Vision", "Design & UX"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function ProjectsShowcase({ projects }: { projects: ProjectItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [active, setActive] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const filtered = projects.filter((p) => {
    if (selectedCategory === "Tous") return true;
    if (selectedCategory === "Web & Cloud") return p.formationTitle.includes("Web");
    if (selectedCategory === "Intelligence Artificielle") return p.formationTitle.includes("Intelligence");
    if (selectedCategory === "Drone & Vision") return p.formationTitle.includes("Drone");
    if (selectedCategory === "Design & UX") return p.formationTitle.includes("Design");
    return true;
  });

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                className={`border px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "border-ink bg-ink text-paper" : "border-ink/25 text-ink hover:border-ink"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
          {filtered.length} projet{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 border border-ink p-12 text-center">
          <p className="display-sm text-ink">Aucun projet dans cette catégorie pour le moment.</p>
          <button onClick={() => setSelectedCategory("Tous")} className="btn btn-ink mt-6">
            Voir tous les projets
          </button>
        </div>
      ) : (
        <div className="grid-lines mt-8 grid md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((proj, i) => {
            const techList = JSON.parse(proj.technologies || "[]") as string[];
            const team = JSON.parse(proj.teamMembers || "[]") as TeamMember[];
            const lead = team[0];
            const avatar = lead ? memberAvatar(lead.name) : null;

            return (
              <article key={proj.id} className="group flex flex-col bg-paper">
                <button
                  onClick={() => setActive(proj)}
                  className="relative block aspect-[16/10] w-full overflow-hidden border-b border-ink bg-ink/5 text-left"
                  aria-label={`Voir les détails de ${proj.title}`}
                >
                  <Image
                    src={proj.coverImage}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="tag tag-paper absolute left-4 top-4">{proj.formationTitle}</span>
                  <span className="numeral absolute bottom-3 right-4 text-5xl text-paper drop-shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display-sm text-ink">
                    <button onClick={() => setActive(proj)} className="text-left hover:text-brand-700">
                      {proj.title}
                    </button>
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-brand-700">{proj.tagline}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{proj.description}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {techList.slice(0, 5).map((t) => (
                      <span key={t} className="tag border-ink/20 text-ink/60">
                        {t}
                      </span>
                    ))}
                    {techList.length > 5 && <span className="tag border-ink/20 text-ink/40">+{techList.length - 5}</span>}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink pt-5">
                    <div className="flex items-center gap-2.5">
                      {avatar ? (
                        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-ink/10">
                          <Image src={avatar} alt="" fill sizes="32px" className="object-cover" />
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-paper">
                          {lead ? initials(lead.name) : "FC"}
                        </span>
                      )}
                      <span>
                        <span className="block text-xs font-bold text-ink">{lead?.name || "Étudiant FuturCraft"}</span>
                        <span className="block text-[11px] text-ink/50">
                          {team.length > 1 ? `+ ${team.length - 1} membre${team.length > 2 ? "s" : ""}` : lead?.role || ""}
                        </span>
                      </span>
                    </div>
                    <button onClick={() => setActive(proj)} className="arrow-link text-xs uppercase tracking-[0.14em] text-ink">
                      Détails <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modale */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-ink bg-paper animate-fade-up sm:hard-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] border-b border-ink bg-ink">
              <Image
                src={active.coverImage}
                alt={active.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-paper bg-ink text-paper transition-colors hover:bg-paper hover:text-ink"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <span className="tag tag-solid">{active.formationTitle}</span>
              <h3 id="project-modal-title" className="display-md mt-4 text-ink">
                {active.title}
              </h3>
              <p className="mt-2 text-base font-semibold text-brand-700">{active.tagline}</p>

              <div className="mt-8 grid gap-8 md:grid-cols-12">
                <div className="md:col-span-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Le projet</p>
                  <p className="mt-3 text-sm leading-7 text-ink/75">{active.description}</p>

                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Stack technique</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(JSON.parse(active.technologies || "[]") as string[]).map((t) => (
                      <span key={t} className="tag border-ink text-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Équipe de conception</p>
                  <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                    {(JSON.parse(active.teamMembers || "[]") as TeamMember[]).map((tm) => {
                      const av = memberAvatar(tm.name);
                      return (
                        <li key={tm.name} className="flex items-center gap-3 py-3">
                          {av ? (
                            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-ink/10">
                              <Image src={av} alt="" fill sizes="36px" className="object-cover" />
                            </span>
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-paper">
                              {initials(tm.name)}
                            </span>
                          )}
                          <span>
                            <span className="block text-sm font-bold text-ink">{tm.name}</span>
                            <span className="block text-[11px] text-ink/55">{tm.role}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink pt-6">
                {active.projectUrl && (
                  <a href={active.projectUrl} target="_blank" rel="noreferrer" className="btn btn-ink">
                    <ExternalLink className="h-4 w-4" />
                    Démo en ligne
                  </a>
                )}
                {active.githubUrl && (
                  <a href={active.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                    <Code2 className="h-4 w-4" />
                    Code source
                  </a>
                )}
                <button onClick={() => setActive(null)} className="ml-auto text-sm font-semibold text-ink/60 hover:text-ink">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
