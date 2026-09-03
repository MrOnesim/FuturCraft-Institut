"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface EventRegistrationFormProps {
  eventTitle: string;
  eventSlug: string;
  /** L'événement est passé : le formulaire devient une demande d'information sur la prochaine édition. */
  past?: boolean;
}

/**
 * Inscription à un événement du campus. Le téléphone est le champ clé (WhatsApp),
 * l'email reste facultatif. Enregistré via /api/contact (kind = "event").
 */
export function EventRegistrationForm({ eventTitle, eventSlug, past = false }: EventRegistrationFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [website, setWebsite] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "event",
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: past ? "Prochaine édition — événement" : "Inscription événement",
          context: eventTitle,
          message: form.message,
          source: `/evenements/${eventSlug}`,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Merci de réessayer.");
        return;
      }
      setDone(true);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau ou écrivez-nous sur WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="border border-paper/30 bg-paper/10 p-6" role="status">
        <CheckCircle2 className="h-8 w-8 text-accent-400" />
        <p className="display-sm mt-4 text-paper">{past ? "Demande enregistrée." : "Votre place est réservée."}</p>
        <p className="mt-2 text-sm leading-6 text-paper/75">
          Merci {form.name.split(" ")[0]}. Nous vous confirmons les détails pratiques par WhatsApp au {form.phone}
          {form.email ? ` et par email à ${form.email}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="ev-website">Site web</label>
        <input id="ev-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <label htmlFor="ev-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
          Nom & prénom *
        </label>
        <input
          id="ev-name"
          type="text"
          required
          autoComplete="name"
          placeholder="ex : Awa KOFFI"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 w-full border-b-2 border-paper/50 bg-transparent py-2.5 text-base text-paper placeholder:text-paper/35 focus:border-accent-400 focus:outline-none"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ev-phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
            WhatsApp / téléphone *
          </label>
          <input
            id="ev-phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+229 …"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-2 w-full border-b-2 border-paper/50 bg-transparent py-2.5 text-base text-paper placeholder:text-paper/35 focus:border-accent-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ev-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
            Email <span className="normal-case tracking-normal text-paper/40">(facultatif)</span>
          </label>
          <input
            id="ev-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full border-b-2 border-paper/50 bg-transparent py-2.5 text-base text-paper placeholder:text-paper/35 focus:border-accent-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="ev-message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60">
          Une précision ? <span className="normal-case tracking-normal text-paper/40">(facultatif)</span>
        </label>
        <textarea
          id="ev-message"
          rows={2}
          placeholder="Nombre de personnes, question, besoin particulier…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-2 w-full resize-y border-b-2 border-paper/50 bg-transparent py-2.5 text-base text-paper placeholder:text-paper/35 focus:border-accent-400 focus:outline-none"
        />
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 border border-paper/40 px-4 py-3 text-sm text-paper">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {error}
        </p>
      )}

      <button type="submit" disabled={sending} className="btn btn-accent btn-lg w-full whitespace-normal disabled:cursor-wait disabled:opacity-70">
        {sending ? (
          <>
            Envoi en cours… <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            {past ? "Me prévenir de la prochaine édition" : "Je réserve ma place"} <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-[11px] leading-5 text-paper/50">
        Gratuit et sans engagement. Vos coordonnées servent uniquement à organiser l&apos;événement.
      </p>
    </form>
  );
}
