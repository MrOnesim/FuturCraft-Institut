import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/** Manifeste web : icône d'accueil sur mobile et couleurs de thème. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Formations aux métiers du numérique`,
    short_name: "FuturCraft",
    description: SITE_DESCRIPTION,
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f2",
    theme_color: "#0b0f1a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
