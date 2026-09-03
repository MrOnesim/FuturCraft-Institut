import { ArrowUpRight } from "lucide-react";

/**
 * Badge circulaire au texte tournant — signature graphique éditoriale.
 * Le texte doit rester court (≈ 36 caractères max) pour tenir sur le cercle.
 */
export function RotatingBadge({
  text = "Admissions ouvertes • Rentrée 2026 • ",
  className = "",
  tone = "ink",
}: {
  text?: string;
  className?: string;
  tone?: "ink" | "accent" | "paper";
}) {
  const bg = tone === "ink" ? "bg-ink text-paper" : tone === "accent" ? "bg-accent-500 text-ink" : "bg-paper text-ink";
  return (
    <div className={`relative flex h-28 w-28 items-center justify-center rounded-full ${bg} ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id="fc-circle" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
        </defs>
        <text
          className="fill-current font-sans font-bold uppercase"
          style={{ fontSize: "8px", letterSpacing: "0.12em" }}
        >
          <textPath href="#fc-circle">{text}</textPath>
        </text>
      </svg>
      <ArrowUpRight className="h-6 w-6" />
    </div>
  );
}
