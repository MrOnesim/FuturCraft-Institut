import { getCompanyOffers } from "@/lib/data-service";
import type { Metadata } from "next";
import { CompanyPortal } from "@/components/CompanyPortal";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Espace Entreprises",
  description:
    "Recrutez nos étudiants formés aux technologies modernes, déposez des offres de stage ou d'emploi et rejoignez notre réseau d'entreprises partenaires.",
  alternates: { canonical: "/entreprises" },
  openGraph: {
    title: "Espace Entreprises | FuturCraft Institut",
    description:
      "Recrutez nos étudiants formés aux technologies modernes, déposez des offres de stage ou d'emploi et rejoignez notre réseau d'entreprises partenaires.",
    url: "/entreprises",
  },
};

const perks = [
  { n: "01", title: "Profils opérationnels", text: "Des talents formés sur des cas réels, évalués sur des livrables et une soutenance devant jury." },
  { n: "02", title: "Recrutement facilité", text: "Publiez vos offres de stage, alternance ou CDI et recevez des candidatures qualifiées." },
  { n: "03", title: "Projets sur mesure", text: "Confiez un projet à une promotion encadrée : site, application, campagne, captation drone." },
  { n: "04", title: "Partenariat durable", text: "Interventions, masterclasses, visites d'entreprise : construisons ensemble le vivier de demain." },
];

export default async function EntreprisesPage() {
  const offers = await getCompanyOffers();

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Écosystème professionnel & talents"
        title={
          <>
            Recrutez des talents
            <br />
            <span className="serif-accent font-normal text-brand-700">prêts à produire.</span>
          </>
        }
        description="Accédez au vivier de talents de FuturCraft Institut : des profils formés sur des cas réels, prêts à intégrer vos équipes techniques, créatives ou marketing."
      />

      <section className="border-b border-ink bg-paper-100">
        <div className="wrap py-12 lg:py-16">
          <div className="grid gap-px border border-ink bg-ink sm:grid-cols-2 xl:grid-cols-4">
            {perks.map((p) => (
              <div key={p.n} className="bg-paper p-6 lg:p-7">
                <p className="numeral text-3xl text-brand-700/30">{p.n}</p>
                <h2 className="display-sm mt-5 text-ink">{p.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/65">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-14 lg:py-20">
        <CompanyPortal initialOffers={offers} />
      </section>
    </div>
  );
}
