import { getProjects } from "@/lib/data-service";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Projets Étudiants | FuturCraft Institut Bénin",
  description:
    "Découvrez les applications, plateformes et solutions concrètes développées par les étudiants de FuturCraft : e-commerce, IA, drones, e-santé.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const formationsCount = new Set(projects.map((p) => p.formationTitle)).size;

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Portfolio des promotions"
        title={
          <>
            Des idées <span className="serif-accent font-normal text-brand-700">livrées</span>
            <br />
            en production.
          </>
        }
        description="Chaque parcours FuturCraft se termine par un projet réel, déployé et soutenu devant un jury professionnel. Voici quelques-unes de ces réalisations."
        aside={
          <dl className="grid grid-cols-2 gap-4 border-t border-ink pt-5">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Projets publiés</dt>
              <dd className="numeral mt-2 text-4xl text-ink">{String(projects.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">Filières</dt>
              <dd className="numeral mt-2 text-4xl text-ink">{String(formationsCount).padStart(2, "0")}</dd>
            </div>
          </dl>
        }
      />

      <section className="wrap py-14 lg:py-20">
        <ProjectsShowcase projects={projects} />
      </section>

      <section className="border-t border-ink bg-brand-700 text-paper">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-8">
            <p className="eyebrow text-accent-400">Entreprises & recruteurs</p>
            <h2 className="display-md mt-5">
              Vous avez un projet ?{" "}
              <span className="serif-accent font-normal text-accent-400">Confiez-le à une promotion.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-paper/75">
              Nos étudiants réalisent des projets réels pour des entreprises partenaires, encadrés par leurs
              formateurs. Une solution concrète pour vous, une expérience professionnelle pour eux.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
            <Link href="/entreprises" className="btn btn-accent btn-lg">
              Proposer un projet
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/formations" className="btn btn-outline-light btn-lg">
              Voir les formations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
