"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowUpRight, Flame, LayoutGrid, Rows3, Clock, GraduationCap } from "lucide-react";

interface Formation {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  duration: string;
  level: string;
  price: number;
  registrationFee: number;
  campus: string;
  mode: string;
  isPopular: boolean | null;
  competencies: string;
  tools: string;
  imageUrl: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

const shortDuration = (d: string) => d.split(" (")[0];

export function FormationsExplorer({ formations }: { formations: Formation[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [view, setView] = useState<"grid" | "list">("grid");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    formations.forEach((f) => counts.set(f.category, (counts.get(f.category) || 0) + 1));
    return [{ name: "Tous", count: formations.length }, ...Array.from(counts, ([name, count]) => ({ name, count }))];
  }, [formations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return formations.filter((f) => {
      const matchCat = selectedCategory === "Tous" || f.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const tools = (JSON.parse(f.tools || "[]") as string[]).join(" ").toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.shortDescription.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        tools.includes(q)
      );
    });
  }, [formations, selectedCategory, search]);

  const reset = () => {
    setSearch("");
    setSelectedCategory("Tous");
  };

  return (
    <div>
      {/* Barre d'outils */}
      <div className="flex flex-col gap-6 border-b-2 border-ink pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                  active ? "border-ink bg-ink text-paper" : "border-ink/25 bg-transparent text-ink hover:border-ink"
                }`}
                aria-pressed={active}
              >
                {cat.name}
                <span className={`tabular-nums ${active ? "text-accent-400" : "text-ink/40"}`}>{cat.count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <label className="relative flex-1 lg:w-80">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              placeholder="Rechercher : React, Python, Drone, Figma…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-line pl-7 text-sm"
              aria-label="Rechercher une formation"
            />
          </label>
          <div className="hidden items-center border border-ink sm:flex" role="group" aria-label="Affichage">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`}
              aria-label="Vue grille"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition-colors ${view === "list" ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"}`}
              aria-label="Vue liste"
              aria-pressed={view === "list"}
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
        {filtered.length} formation{filtered.length > 1 ? "s" : ""}
        {selectedCategory !== "Tous" ? ` · ${selectedCategory}` : ""}
        {search ? ` · « ${search} »` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 border border-ink p-12 text-center">
          <p className="display-sm text-ink">Aucune formation ne correspond.</p>
          <p className="mt-2 text-sm text-ink/60">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
          <button onClick={reset} className="btn btn-ink mt-6">
            Réinitialiser
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid-lines mt-8 grid sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((f, i) => {
            const competencies = (JSON.parse(f.competencies || "[]") as string[]).slice(0, 3);
            const tools = (JSON.parse(f.tools || "[]") as string[]).slice(0, 4);
            return (
              <article key={f.id} className="group flex flex-col bg-paper">
                <Link href={`/formation/${f.slug}`} className="relative block aspect-[16/10] overflow-hidden border-b border-ink bg-ink/5">
                  <Image
                    src={f.imageUrl}
                    alt={f.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="tag tag-paper">{f.category}</span>
                    {f.isPopular && (
                      <span className="tag tag-accent">
                        <Flame className="h-3 w-3" /> Populaire
                      </span>
                    )}
                  </div>
                  <span className="numeral absolute bottom-3 right-4 text-5xl text-paper/90 drop-shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-ink/55">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {shortDuration(f.duration)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> {f.level.split(" (")[0]}
                    </span>
                  </div>
                  <h3 className="display-sm mt-3 text-ink">
                    <Link href={`/formation/${f.slug}`} className="hover:text-brand-700">
                      {f.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{f.shortDescription}</p>

                  <ul className="mt-5 space-y-1.5 border-t border-ink/10 pt-4">
                    {competencies.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[13px] leading-5 text-ink/80">
                        <span className="mt-2 h-1 w-1 shrink-0 bg-brand-700" />
                        <span className="line-clamp-1">{c}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tools.map((t) => (
                      <span key={t} className="tag border-ink/20 text-ink/60">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink pt-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">Coût global</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink">
                        {formatPrice(f.price)} <span className="text-xs font-semibold text-ink/50">FCFA</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/formation/${f.slug}`} className="btn btn-outline btn-sm">
                        Détails
                      </Link>
                      <Link href={`/inscription?formationId=${f.id}`} className="btn btn-ink btn-sm">
                        Candidater
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <ol className="mt-8 border-t-2 border-ink">
          {filtered.map((f, i) => (
            <li key={f.id} className="border-b border-ink">
              <Link
                href={`/formation/${f.slug}`}
                className="group grid items-center gap-4 py-6 transition-colors hover:bg-ink hover:text-paper sm:grid-cols-12 sm:gap-6"
              >
                <span className="numeral px-1 text-2xl text-ink/30 group-hover:text-accent-400 sm:col-span-1 sm:px-2 lg:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="px-1 sm:col-span-6 sm:px-2 lg:col-span-5">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700 group-hover:text-accent-400">
                    {f.category}
                    {f.isPopular && <Flame className="h-3 w-3" />}
                  </p>
                  <h3 className="display-sm mt-2">{f.title}</h3>
                </div>
                <div className="hidden text-sm lg:col-span-2 lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 group-hover:text-paper/40">Durée</p>
                  <p className="mt-1 font-semibold">{shortDuration(f.duration)}</p>
                </div>
                <div className="hidden text-sm lg:col-span-2 lg:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 group-hover:text-paper/40">Niveau</p>
                  <p className="mt-1 font-semibold">{f.level.split(" (")[0]}</p>
                </div>
                <div className="flex items-center justify-between gap-4 px-1 sm:col-span-5 sm:px-2 lg:col-span-2 lg:justify-end">
                  <div className="lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 group-hover:text-paper/40">Tarif</p>
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
      )}
    </div>
  );
}
