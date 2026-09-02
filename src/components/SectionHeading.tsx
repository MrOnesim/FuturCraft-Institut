import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
}

/**
 * En-tête de section éditorial : sur-titre numéroté, grand titre, description,
 * et une action optionnelle alignée à droite (sur desktop).
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  tone = "light",
  action,
  className = "",
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"
      } ${className}`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-3xl"}>
        {(eyebrow || index) && (
          <p className={`eyebrow ${isDark ? "text-accent-400" : "text-brand-700"}`}>
            {index && <span className="tabular-nums">{index}</span>}
            {index && eyebrow && <span className={isDark ? "text-paper/30" : "text-ink/30"}>/</span>}
            {eyebrow}
          </p>
        )}
        <h2 className={`display-md mt-5 ${isDark ? "text-paper" : "text-ink"}`}>{title}</h2>
        {description ? (
          <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${isDark ? "text-paper/65" : "text-ink/65"}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
