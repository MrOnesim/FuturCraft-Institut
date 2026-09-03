import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FuturCraft Institut | Centre de formation aux métiers du numérique au Bénin",
    template: "%s | FuturCraft Institut",
  },
  alternates: { canonical: "/" },
  description:
    "Construisez les compétences de demain : Développement Web Fullstack, Intelligence Artificielle, Web Design, Pilotage de Drone, Marketing Digital, Sérigraphie et Audiovisuel à Godomey, Supermarché O Bénin Avant pk14.",
  keywords: [
    "FuturCraft Institut",
    "Formation informatique Bénin",
    "Développement Web Cotonou",
    "Intelligence Artificielle Bénin",
    "Pilotage Drone Bénin",
    "UI/UX Design Cotonou",
    "École du numérique Afrique",
  ],
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: "/",
    siteName: "FuturCraft Institut",
    title: "FuturCraft Institut | Centre de formation aux métiers du numérique au Bénin",
    description:
      "Développement Web, Intelligence Artificielle, UI/UX Design, Drone, Marketing Digital & plus encore à Godomey, Supermarché O Bénin Avant pk14.",
  },
  // Titre/description Twitter hérités de l'Open Graph de chaque page (pas de valeurs figées ici).
  twitter: { card: "summary_large_image" },
  applicationName: "FuturCraft Institut",
  category: "education",
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0f1a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        {/* Active les animations d'apparition uniquement si JavaScript est disponible (avant le premier rendu) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-paper"
        >
          Aller au contenu principal
        </a>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
