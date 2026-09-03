import { getBlogArticleBySlug } from "@/lib/data-service";
import { OG_CONTENT_TYPE, OG_SIZE, publicImageDataUrl, renderOgCard } from "@/lib/og";

export const alt = "Article du journal FuturCraft Institut";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);

  if (!article) {
    return renderOgCard({ eyebrow: "Actualités", title: "Article introuvable", chips: ["FuturCraft Institut"] });
  }

  return renderOgCard({
    eyebrow: `Journal · ${article.category}`,
    title: article.title,
    description: article.excerpt,
    chips: [article.publishedAt, article.readTime, article.author.split(",")[0].trim()],
    backgroundImage: await publicImageDataUrl(article.coverImage),
  });
}
