import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { CONTACT, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & orientation",
  description:
    "Parlez de votre projet avec un conseiller FuturCraft Institut : téléphone, WhatsApp, email ou formulaire. Campus de Godomey, Supermarché O Bénin, avant PK14 (Cotonou). Réponse sous 24 h.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & orientation | FuturCraft Institut",
    description:
      "Téléphone, WhatsApp, email ou formulaire : un conseiller d'orientation vous répond sous 24 h. Campus de Godomey, Cotonou.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

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
                    {CONTACT.addressLine}
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
                    <a href={`tel:${CONTACT.phonePrimaryE164}`} className="block hover:text-accent-400">
                      {CONTACT.phonePrimary}
                    </a>
                    <a href={`tel:${CONTACT.phoneSecondaryE164}`} className="block hover:text-accent-400">
                      {CONTACT.phoneSecondary}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[32px_1fr]">
                <Mail className="h-4 w-4 text-accent-400" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-paper/50">Email</dt>
                  <dd className="mt-1.5 space-y-0.5 font-display text-lg font-bold">
                    <a href={`mailto:${CONTACT.email}`} className="block break-all hover:text-accent-400">
                      {CONTACT.email}
                    </a>
                    <a href={`mailto:${CONTACT.emailAlt}`} className="block break-all hover:text-accent-400">
                      {CONTACT.emailAlt}
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
              href={whatsappUrl("Bonjour, je souhaite des informations sur les formations FuturCraft")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-accent btn-lg mt-8 w-full sm:w-auto"
            >
              Discuter sur WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </aside>

        {/* Formulaire (composant client) */}
        <ContactForm />
      </div>
    </div>
  );
}
