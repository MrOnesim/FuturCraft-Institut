import { getFormationBySlug } from "@/lib/data-service";
import { OG_CONTENT_TYPE, OG_SIZE, publicImageDataUrl, renderOgCard } from "@/lib/og";

export const alt = "Fiche formation FuturCraft Institut";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const formatPrice = (price: number) => `${new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ")} FCFA`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);

  if (!formation) {
    return renderOgCard({ eyebrow: "Formation", title: "Formation introuvable", chips: ["FuturCraft Institut"] });
  }

  return renderOgCard({
    eyebrow: `Formation · ${formation.category}`,
    title: formation.title,
    description: formation.shortDescription,
    chips: [formatPrice(formation.price), formation.duration.split(" (")[0], formation.mode],
    backgroundImage: await publicImageDataUrl(formation.imageUrl),
  });
}
