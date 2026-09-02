"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-start gap-3 border border-paper/30 bg-paper/10 px-5 py-4 text-left">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
        <div>
          <p className="text-sm font-bold text-paper">Merci !</p>
          <p className="mt-0.5 text-xs leading-5 text-paper/75">
            La brochure des formations sera envoyée à <strong className="text-paper">{email}</strong>. Un conseiller
            peut aussi vous rappeler.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative" noValidate>
      <div className="flex border-b-2 border-paper/60 focus-within:border-accent-400">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          aria-label="Votre adresse email"
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-paper placeholder:text-paper/45 focus:outline-none"
        />
        <button
          type="submit"
          className="group flex shrink-0 items-center gap-2 pl-4 text-sm font-bold text-paper transition-colors hover:text-accent-400"
        >
          Recevoir
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-accent-300">{error}</p>}
    </form>
  );
}
