"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

interface ShareBarProps {
  /** URL absolue de la page à partager. */
  url: string;
  title: string;
  /** Message d'accroche pour WhatsApp (le lien est ajouté automatiquement). */
  text?: string;
  tone?: "light" | "dark";
}

/**
 * Boutons de partage : WhatsApp (canal n°1 au Bénin), Facebook, partage natif
 * mobile quand disponible, et copie du lien.
 */
const noop = () => () => {};
const readCanShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";
const serverCanShare = () => false;

export function ShareBar({ url, title, text, tone = "light" }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  // Évite un décalage d'hydratation : côté serveur, le partage natif est réputé indisponible.
  const canShare = useSyncExternalStore(noop, readCanShare, serverCanShare);
  const message = `${text || title} ${url}`;

  const base =
    tone === "dark"
      ? "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink"
      : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper";
  const cls = `inline-flex items-center gap-2 border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${base}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez ce lien :", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: text || title, url });
    } catch {
      /* partage annulé */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Partager cette page">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className={cls}
      >
        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className={cls}
      >
        <span aria-hidden="true" className="text-sm leading-none">
          f
        </span>
        Facebook
      </a>
      <button type="button" onClick={copy} className={cls}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Lien copié" : "Copier le lien"}
      </button>
      {canShare && (
        <button type="button" onClick={nativeShare} className={`${cls} sm:hidden`}>
          <Share2 className="h-3.5 w-3.5" /> Partager
        </button>
      )}
    </div>
  );
}
