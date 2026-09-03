import { getEventBySlug } from "@/lib/data-service";
import { OG_CONTENT_TYPE, OG_SIZE, publicImageDataUrl, renderOgCard } from "@/lib/og";

export const alt = "Événement du campus FuturCraft Institut";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return renderOgCard({ eyebrow: "Événement", title: "Événement introuvable", chips: ["FuturCraft Institut"] });
  }

  return renderOgCard({
    eyebrow: `Événement · ${event.category}`,
    title: event.title,
    description: event.description,
    chips: [event.date, event.location, "Entrée gratuite"],
    backgroundImage: await publicImageDataUrl(event.imageUrl),
  });
}
