import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-paper">
      <section className="border-b border-ink">
        <div className="wrap grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brand-700">Erreur 404</p>
            <p className="numeral mt-6 text-[clamp(6rem,22vw,20rem)] text-ink" aria-hidden>
              404
            </p>
            <h1 className="display-md mt-2 text-ink">
              Cette page n&apos;existe pas —{" "}
              <span className="serif-accent font-normal text-brand-700">ou plus.</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base leading-7 text-ink/65">
              L&apos;adresse est peut-être erronée ou le contenu a été déplacé. Pas de panique : le campus n&apos;est
              jamais loin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-ink">
                Retour à l&apos;accueil
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/formations" className="btn btn-outline">
                Voir les formations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
