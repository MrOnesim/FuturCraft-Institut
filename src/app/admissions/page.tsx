import Link from "next/link";
import { ArrowUpRight, Smartphone, CreditCard, Banknote } from "lucide-react";
import { getFormations } from "@/lib/data-service";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admissions & Tarifs | FuturCraft Institut Bénin",
  description:
    "Modalités d'admission, grille tarifaire transparente en FCFA, facilités de paiement échelonné en 3 à 5 fois et FAQ.",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

const steps = [
  {
    n: "01",
    title: "Exploration & choix",
    desc: "Découvrez notre catalogue de 12 formations. Un conseiller vous aide gratuitement si vous hésitez sur votre orientation.",
    meta: "Catalogue gratuit",
  },
  {
    n: "02",
    title: "Candidature en ligne",
    desc: "Remplissez le formulaire en quelques minutes et obtenez instantanément votre numéro de dossier unique.",
    meta: "Réponse instantanée",
  },
  {
    n: "03",
    title: "Validation & paiement",
    desc: "Réglez vos frais d'inscription (25 000 FCFA) par MoMo, Moov Money, carte ou au guichet pour réserver votre place.",
    meta: "Paiement sécurisé",
  },
  {
    n: "04",
    title: "Accès & rentrée",
    desc: "Téléchargez votre reçu certifié, votre attestation, et intégrez le groupe de votre promotion pour démarrer.",
    meta: "Accès immédiat",
  },
];

const faqs = [
  {
    q: "Quelles sont les conditions de diplôme pour intégrer FuturCraft ?",
    a: "La majorité de nos formations sont ouvertes à partir du niveau BEPC ou Baccalauréat. Pour la filière Intelligence Artificielle avancée, un profil scientifique ou une appétence pour les mathématiques est recommandé.",
  },
  {
    q: "Peut-on payer la scolarité en plusieurs fois ?",
    a: "Absolument. Chaque cursus dispose d'un échéancier en 3 à 5 mensualités personnalisées. Le premier versement correspond aux frais d'inscription de 25 000 FCFA.",
  },
  {
    q: "Quels moyens de paiement sont acceptés au Bénin ?",
    a: "Nous acceptons MTN Mobile Money, Moov Money, les cartes bancaires Visa/Mastercard ainsi que les règlements en espèces à la caisse de notre campus de Godomey (Cotonou).",
  },
  {
    q: "Faut-il obligatoirement son propre ordinateur ?",
    a: "Un ordinateur personnel est fortement recommandé pour pratiquer chez vous. Cependant, nos laboratoires informatiques sont entièrement équipés et en libre accès pour les étudiants inscrits.",
  },
];

export default async function AdmissionsPage() {
  const formations = await getFormations();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-paper">
      <PageHero
        eyebrow="Admissions ouvertes — Session 2026"
        title={
          <>
            Simple, transparent,
            <br />
            <span className="serif-accent font-normal text-brand-700">sans frais cachés.</span>
          </>
        }
        description="Une formation d'excellence accessible à tous : tarifs fermes en FCFA, paiement échelonné pour chaque cursus, et un processus 100 % digital du dossier au reçu certifié."
        aside={
          <div className="flex flex-wrap gap-3">
            <Link href="/inscription" className="btn btn-ink">
              Démarrer mon inscription
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="#tarifs" className="btn btn-outline">
              Voir les tarifs
            </a>
          </div>
        }
      />

      {/* Étapes */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="01"
            eyebrow="Parcours d'admission"
            title="Quatre étapes, aucune paperasse."
            description="Le processus est entièrement digitalisé, du choix de la filière à la remise du reçu certifié."
          />
          <ol className="mt-14 grid gap-px border border-ink bg-ink md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col bg-paper p-7 lg:min-h-[320px] lg:p-8">
                <div className="flex items-start justify-between">
                  <p className="numeral text-6xl text-ink lg:text-7xl">{s.n}</p>
                  <span className="tag text-ink/60">{s.meta}</span>
                </div>
                <h3 className="display-sm mt-auto pt-10 text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Grille tarifaire */}
      <section id="tarifs" className="scroll-mt-32 border-b border-ink bg-paper-100">
        <div className="wrap py-20 lg:py-28">
          <SectionHeading
            index="02"
            eyebrow="Grille tarifaire officielle"
            title={
              <>
                Frais & <span className="serif-accent font-normal text-brand-700">échéanciers.</span>
              </>
            }
            description="Tous nos tarifs sont fermes et transparents. Les frais de dossier sont inclus dans le coût global, le solde est réparti en mensualités."
          />

          <div className="mt-14 overflow-x-auto border border-ink bg-paper">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink text-[10px] font-bold uppercase tracking-[0.2em] text-ink/55">
                  <th className="px-5 py-4 font-bold">#</th>
                  <th className="px-5 py-4 font-bold">Formation</th>
                  <th className="px-5 py-4 font-bold">Durée</th>
                  <th className="px-5 py-4 font-bold">Dossier</th>
                  <th className="px-5 py-4 font-bold">Coût global</th>
                  <th className="px-5 py-4 font-bold">Facilité</th>
                  <th className="px-5 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="pricing-table divide-y divide-ink/15">
                {formations.map((f, i) => (
                  <tr key={f.id} className="group transition-colors">
                    <td className="numeral px-5 py-4 text-base text-ink/35">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-4">
                      <Link href={`/formation/${f.slug}`} className="font-display text-base font-bold text-ink hover:text-brand-700">
                        {f.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-ink/50">{f.category}</p>
                    </td>
                    <td className="px-5 py-4 text-ink/75">{f.duration.split(" (")[0]}</td>
                    <td className="px-5 py-4 text-ink/75">{formatPrice(f.registrationFee)} F</td>
                    <td className="px-5 py-4 font-display text-base font-bold text-ink">{formatPrice(f.price)} FCFA</td>
                    <td className="px-5 py-4">
                      <span className="tag border-brand-700 text-brand-700">{f.installmentsCount} tranches</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/inscription?formationId=${f.id}`} className="btn btn-ink btn-sm">
                        Candidater
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-3">
            {[
              { icon: Smartphone, title: "Mobile Money", text: "MTN MoMo et Moov Money, confirmation immédiate." },
              { icon: CreditCard, title: "Carte bancaire", text: "Visa et Mastercard, paiement sécurisé en ligne." },
              { icon: Banknote, title: "Caisse du campus", text: "Espèces ou dépôt au guichet, reçu certifié remis sur place." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 bg-paper p-6">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <div>
                  <p className="font-display text-base font-bold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-ink bg-paper">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brand-700">
              <span className="tabular-nums">03</span>
              <span className="text-ink/30">/</span>
              FAQ
            </p>
            <h2 className="display-md mt-5 text-ink">Questions fréquentes</h2>
            <p className="mt-5 text-base leading-7 text-ink/65">
              Tout ce que les futurs étudiants et leurs parents souhaitent savoir avant de s&apos;inscrire.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link href="/contact" className="btn btn-outline">
                Contacter un conseiller
              </Link>
            </div>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <div className="wrap flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <h2 className="display-md max-w-2xl">
            Votre place se réserve en{" "}
            <span className="serif-accent font-normal text-accent-400">cinq minutes.</span>
          </h2>
          <Link href="/inscription" className="btn btn-accent btn-lg shrink-0">
            Démarrer mon inscription
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
