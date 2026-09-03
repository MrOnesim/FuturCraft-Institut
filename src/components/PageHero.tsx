import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  tone?: "paper" | "ink" | "brand";
  children?: ReactNode;
}

const tones = {
  paper: {
    section: "bg-paper text-ink border-b border-ink",
    eyebrow: "text-brand-700",
    desc: "text-ink/65",
  },
  ink: {
    section: "bg-ink text-paper",
    eyebrow: "text-accent-400",
    desc: "text-paper/65",
  },
  brand: {
    section: "bg-brand-700 text-paper",
    eyebrow: "text-accent-400",
    desc: "text-paper/75",
  },
};

/**
 * En-tête de page éditorial : très grand titre aligné à gauche, description
 * en colonne droite, et un espace optionnel « aside » (chiffres, méta…).
 */
export function PageHero({ eyebrow, title, description, aside, tone = "paper", children }: PageHeroProps) {
  const t = tones[tone];
  return (
    <section className={`relative overflow-hidden ${t.section}`}>
      <div className="wrap relative pb-14 pt-14 lg:pb-20 lg:pt-20">
        {eyebrow && <p className={`eyebrow animate-fade-up ${t.eyebrow}`}>{eyebrow}</p>}
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="display-lg animate-fade-up delay-100 lg:col-span-8">{title}</h1>
          {(description || aside) && (
            <div className="animate-fade-up delay-200 lg:col-span-4">
              {description && <p className={`text-base leading-7 sm:text-lg ${t.desc}`}>{description}</p>}
              {aside && <div className="mt-6">{aside}</div>}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
