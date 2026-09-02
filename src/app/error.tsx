"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowUpRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-paper">
      <section className="border-b border-ink">
        <div className="wrap grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brand-700">Une erreur est survenue</p>
            <p className="numeral mt-6 text-[clamp(6rem,22vw,20rem)] text-ink" aria-hidden>
              500
            </p>
            <h1 className="display-md mt-2 text-ink">
              Oups, quelque chose s&apos;est{" "}
              <span className="serif-accent font-normal text-brand-700">mal passé.</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base leading-7 text-ink/65">
              Un problème technique a interrompu l&apos;affichage de cette page. Réessayez ou revenez à
              l&apos;accueil.
            </p>
            {error.digest && (
              <p className="mt-3 text-xs text-ink/40">Référence : {error.digest}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={reset} className="btn btn-ink">
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
              <Link href="/" className="btn btn-outline">
                Accueil
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
