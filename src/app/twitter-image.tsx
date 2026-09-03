import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "FuturCraft Institut — Formations aux métiers du numérique au Bénin";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: "École des métiers du numérique",
    title: "Apprends. Crée.",
    accent: "Innove.",
    description:
      "Développement web, intelligence artificielle, design, drone, marketing digital : 12 formations pratiques à Cotonou.",
    chips: ["Rentrée 2026", "80 % de pratique", "Paiement en plusieurs fois"],
  });
}
