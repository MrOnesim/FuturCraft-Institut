/**
 * Visuels auto-hébergés du site (source de vérité).
 *
 * Les photos de formations sont des illustrations éditoriales générées pour
 * FuturCraft Institut et servies depuis /public/images — plus aucune
 * dépendance à une banque d'images externe (Pexels) au chargement des pages.
 *
 * Utilisé par le seed (nouvelles installations) et par `syncSeedMedia()`
 * (bases déjà peuplées) : remplacer un visuel = changer une entrée ici.
 */

/** Photo par défaut d'une formation dont le visuel n'a pas encore été produit. */
export const FORMATION_FALLBACK_IMAGE = "/images/ange.jpg";

export const formationImages: Record<string, string> = {
  "developpement-web-fullstack": "/images/formations/developpement-web-fullstack.jpg",
  "developpement-intelligence-artificielle": "/images/formations/developpement-intelligence-artificielle.jpg",
  "maitrise-outils-intelligence-artificielle": "/images/formations/maitrise-outils-intelligence-artificielle.jpg",
  "web-design-ui-ux": "/images/formations/web-design-ui-ux.jpg",
  webmaster: "/images/formations/webmaster.jpg",
  "graphisme-et-serigraphie": "/images/formations/graphisme-et-serigraphie.jpg",
  "marketing-digital": "/images/formations/marketing-digital.jpg",
  "maintenance-informatique-et-reseau": "/images/formations/maintenance-informatique-et-reseau.jpg",
  "photographie-cadrage-et-montage-video": "/images/formations/photographie-cadrage-et-montage-video.jpg",
  copywriting: "/images/formations/copywriting.jpg",
  // Visuels dédiés à produire : photos du campus en attendant.
  "e-commerce": "/images/projet-vano-baby.jpg",
  "pilotage-de-drone": "/images/Excution-Ganvie.jpg",
};

export function formationImage(slug: string): string {
  return formationImages[slug] ?? FORMATION_FALLBACK_IMAGE;
}

/** Couvertures des projets étudiants (par slug). */
export const projectImages: Record<string, string> = {
  "gen3rvto-rh": "/images/GEN3RVTO.png",
  "ayiha-boost": "/images/AYIHA-Boost.webp",
  "agroconnect-benin": "/images/formations/webmaster.jpg",
  "skyfarm-drone-ai": "/images/Excution-Ganvie.jpg",
  "djidjo-esante": "/images/formations/web-design-ui-ux.jpg",
};

/** Visuels des événements (par titre exact du seed). */
export const eventImages: Record<string, string> = {
  "Hackathon FuturTech 2025 : L'IA au service de l'Afrique": "/images/formations/developpement-intelligence-artificielle.jpg",
  "Masterclass Drone & Cartographie Numérique": "/images/Excution-Ganvie.jpg",
  "Journée Portes Ouvertes & Job Dating Tech": "/images/houessinon.jpg",
};

/** Couvertures des articles (par slug). */
export const articleImages: Record<string, string> = {
  "pourquoi-se-former-au-numerique-au-benin-en-2025": "/images/formations/developpement-web-fullstack.jpg",
  "les-etudiants-de-futurcraft-devoilent-leurs-projets-de-fin-de-cohorte": "/images/projet-vano-baby.jpg",
  "comment-l-ia-transforme-le-travail-des-creatifs-et-marketeurs": "/images/formations/maitrise-outils-intelligence-artificielle.jpg",
};

/** Avatar neutre pour les comptes de démonstration (aucune photo de personne réelle). */
export const AVATAR_PLACEHOLDER = "/images/avatar-placeholder.png";

/** Avatars des étudiants de démonstration (par numéro d'étudiant). */
export const studentAvatars: Record<string, string> = {
  "FC-2025-0142": "/images/Onesim-Graca.jpg",
};

export function studentAvatar(studentNumber: string): string {
  return studentAvatars[studentNumber] ?? AVATAR_PLACEHOLDER;
}
