"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowUpRight, CheckCircle2, ChevronDown } from "lucide-react";

const subjects = [
  "Renseignement sur les formations",
  "Candidature & Inscription",
  "Modalités de paiement",
  "Partenariat entreprise",
  "Autre demande",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-paper">
      {/* En-tête */}
      <section className="border-b border-ink">
        <div className="wrap pb-14 pt-14 lg:pb-20 lg:pt-20">
          <p className="eyebrow animate-fade-up text-brand-700">Contact & orientation</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display-lg animate-fade-up delay-100 lg:col-span-8">
              Parlons de
              <br />
              <span className="serif-accent font-normal text-brand-700">votre projet.</span>
            </h1>
            <p className="animate-fade-up delay-200 text-base leading-7 text-ink/65 sm:text-lg lg:col-span-4">
              Nos équipes pédagogiques et administratives vous répondent sous 24 h pour vous guider vers le métier
              du numérique qui vous correspond.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12">
        {/* Coordonnées */}
        <aside className="border-b border-ink bg-ink text-paper lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="px-5 py-14 sm:px-8 lg:sticky lg:top-[116px] lg:px-12 lg:py-16">
            <p className="eyebrow text-accent-400">Coordonnées</p>
            <dl className="mt-8 divide-y divide-paper/15 border-y border-paper/15">
              <div className="grid gap-2 py-5 sm:grid-cols-[32px_1fr]">
                <MapPin className="h-4 w-4 text-accent-400" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">Campus</dt>
                  <dd className="mt-1.5 font-display text-lg font-bold leading-snug">
                    Godomey, Supermarché O Bénin, avant PK14
                    <br />
                    Cotonou, Bénin
                  </dd>
                </div>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[32px_1fr]">
                <Phone className="h-4 w-4 text-accent-400" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">Téléphone & WhatsApp</dt>
                  <dd className="mt-1.5 space-y-0.5 font-display text-lg font-bold">
                    <a href="tel:+22943327832" className="block hover:text-accent-400">+229 43 32 78 32</a>
                    <a href="tel:+2290197303050" className="block hover:text-accent-400">+229 01 97 30 30 50</a>
                  </dd>
                </div>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[32px_1fr]">
                <Mail className="h-4 w-4 text-accent-400" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">Email</dt>
                  <dd className="mt-1.5 space-y-0.5 font-display text-lg font-bold">
                    <a href="mailto:contact@futurcraftinstitut.com" className="block break-all hover:text-accent-400">
                      contact@futurcraftinstitut.com
                    </a>
                    <a href="mailto:eentreprisebenin@gmail.com" className="block break-all hover:text-accent-400">
                      eentreprisebenin@gmail.com
                    </a>
                  </dd>
                </div>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[32px_1fr]">
                <Clock className="h-4 w-4 text-accent-400" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">Horaires</dt>
                  <dd className="mt-1.5 text-sm leading-6 text-paper/80">
                    Lundi – Vendredi : 08h00 – 18h30
                    <br />
                    Samedi : 09h00 – 14h00
                  </dd>
                </div>
              </div>
            </dl>

            <a
              href="https://wa.me/22943327832?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20les%20formations%20FuturCraft"
              target="_blank"
              rel="noreferrer"
              className="btn btn-accent btn-lg mt-8 w-full sm:w-auto"
            >
              Discuter sur WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </aside>

        {/* Formulaire */}
        <div className="px-5 py-14 sm:px-8 lg:col-span-7 lg:px-16 lg:py-16">
          <p className="eyebrow text-brand-700">Écrire un message</p>
          <h2 className="display-md mt-5 text-ink">Un conseiller vous répond sous 24 h.</h2>

          {submitted ? (
            <div className="mt-10 border border-ink bg-paper p-8 hard-shadow">
              <CheckCircle2 className="h-10 w-10 text-brand-700" />
              <p className="display-sm mt-5 text-ink">Message transmis avec succès.</p>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                Merci {form.name}, notre équipe a bien reçu votre demande concernant « {form.subject} » et vous
                contactera très prochainement.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm mt-6">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="label">Nom & prénom *</label>
                  <input
                    id="c-name"
                    type="text"
                    required
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-ink/50">* Champs obligatoires. Vos données restent confidentielles.</p>
                <button type="submit" className="btn btn-ink btn-lg">
                  Transmettre mon message
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
