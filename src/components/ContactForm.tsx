"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, AlertCircle, Loader2 } from "lucide-react";

const subjects = [
  "Renseignement sur les formations",
  "Candidature & Inscription",
  "Modalités de paiement",
  "Partenariat entreprise",
  "Autre demande",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [website, setWebsite] = useState(""); // pot de miel anti-robots (reste vide)
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website, kind: "contact", source: "/contact" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Merci de réessayer.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau ou écrivez-nous sur WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", subject: subjects[0], message: "" });
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="px-5 py-14 sm:px-8 lg:col-span-7 lg:px-16 lg:py-16">
      <p className="eyebrow text-brand-700">Écrire un message</p>
      <h2 className="display-md mt-5 text-ink">Un conseiller vous répond sous 24 h.</h2>

      {submitted ? (
        <div className="mt-10 border border-ink bg-paper p-8 hard-shadow">
          <CheckCircle2 className="h-10 w-10 text-brand-700" />
          <p className="display-sm mt-5 text-ink">Message transmis avec succès.</p>
          <p className="mt-3 text-sm leading-7 text-ink/65">
            Merci {form.name}, notre équipe a bien reçu votre demande concernant « {form.subject} ». Un accusé
            de réception vous a été envoyé à {form.email} et un conseiller vous contactera sous 24 h ouvrées.
          </p>
          <button onClick={resetForm} className="btn btn-outline btn-sm mt-6">
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-10 space-y-8">
          {/* Pot de miel : invisible pour les humains, rempli par les robots */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="c-website">Site web</label>
            <input
              id="c-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="label">Nom & prénom *</label>
              <input
                id="c-name"
                type="text"
                required
                autoComplete="name"
                placeholder="ex : Jean DOSSOU"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-line"
              />
            </div>
            <div>
              <label htmlFor="c-email" className="label">Adresse email *</label>
              <input
                id="c-email"
                type="email"
                required
                autoComplete="email"
                placeholder="votre.email@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-line"
              />
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="c-phone" className="label">Téléphone *</label>
              <input
                id="c-phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+229 …"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-line"
              />
            </div>
            <div>
              <label htmlFor="c-subject" className="label">Objet *</label>
              <div className="relative">
                <select
                  id="c-subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-line appearance-none pr-8"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="c-message" className="label">Votre message *</label>
            <textarea
              id="c-message"
              rows={5}
              required
              placeholder="Expliquez-nous votre projet ou posez vos questions…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-line resize-y"
            />
          </div>
          {error && (
            <p role="alert" className="flex items-start gap-2 border border-ink bg-paper-100 px-4 py-3 text-sm text-ink">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> {error}
            </p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink/50">* Champs obligatoires. Vos données restent confidentielles.</p>
            <button type="submit" disabled={sending} className="btn btn-ink btn-lg disabled:cursor-wait disabled:opacity-70">
              {sending ? (
                <>
                  Envoi en cours… <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Transmettre mon message <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
