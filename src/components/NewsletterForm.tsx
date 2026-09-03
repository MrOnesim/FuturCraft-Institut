"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  /** Page d'origine, enregistrée avec l'abonnement (ex. "accueil", "actualites"). */
  source?: string;
}

export function NewsletterForm({ source = "site" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // pot de miel anti-robots
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Inscription impossible pour le moment.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau puis réessayez.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-start gap-3 border border-paper/30 bg-paper/10 px-5 py-4 text-left" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
        <div>
          <p className="text-sm font-bold text-paper">Merci, c&apos;est noté !</p>
          <p className="mt-0.5 text-xs leading-5 text-paper/75">
            Un email de bienvenue part vers <strong className="text-paper">{email.trim()}</strong>. Programmes,
            sessions et tarifs y sont détaillés — un conseiller peut aussi vous rappeler.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`nl-website-${source}`}>Site web</label>
        <input
          id={`nl-website-${source}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="flex border-b-2 border-paper/60 focus-within:border-accent-400">
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          aria-label="Votre adresse email"
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-paper placeholder:text-paper/45 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="group flex shrink-0 items-center gap-2 pl-4 text-sm font-bold text-paper transition-colors hover:text-accent-400 disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? "Envoi…" : "Recevoir"}
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-accent-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
