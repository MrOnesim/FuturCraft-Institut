import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { getFormations } from "@/lib/data-service";
import { FormationsExplorer } from "@/components/FormationsExplorer";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Toutes les Formations | FuturCraft Institut Bénin",
  description:
    "Découvrez nos 12 formations professionnelles aux métiers du numérique : Développement Web, IA, UI/UX Design, Drone, Graphisme, Audiovisuel à Godomey, Supermarché O Bénin Avant pk14.",
};

export default async function FormationsPage() {
  const formations = await getFormations();
  const categories = new Set(formations.map((f) => f.category)).size;

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Catalogue 2026 — Admissions ouvertes"
        title={
          <>
            Douze formations,
            <br />
            <span className="serif-accent font-normal text-brand-700">un seul cap :</span> l&apos;emploi.
          </>
        }
        description="De la maîtrise accélérée des outils IA en un mois aux filières complètes de développement logiciel. Pratique intensive, projets réels, certificats professionnels vérifiables."
        aside={
          <dl className="grid grid-cols-3 gap-4 border-t border-ink pt-5">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Filières</dt>
              <dd className="numeral mt-2 text-4xl text-ink">{formations.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Domaines</dt>
              <dd className="numeral mt-2 text-4xl text-ink">{categories}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Durées</dt>
              <dd className="numeral mt-2 text-4xl text-ink">1–9</dd>
              <dd className="text-[11px] text-ink/50">mois</dd>
            </div>
          </dl>
        }
      />

      <section className="wrap py-14 lg:py-20">
        <FormationsExplorer formations={formations} />
      </section>

      {/* Bandeau orientation */}
      <section className="border-t border-ink bg-ink text-paper">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-8">
            <p className="eyebrow text-accent-400">Orientation gratuite</p>
            <h2 className="display-md mt-5">
              Vous hésitez entre deux filières ?{" "}
              <span className="serif-accent font-normal text-accent-400">Parlons-en.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-paper/65">
              Nos conseillers pédagogiques vous aident à identifier la formation la plus adaptée à votre profil, à
              votre disponibilité et à vos ambitions professionnelles.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
            <Link href="/contact" className="btn btn-paper btn-lg">
              <Phone className="h-4 w-4" />
              Prendre rendez-vous
            </Link>
            <Link href="/inscription" className="btn btn-outline-light btn-lg">
              Candidater
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
