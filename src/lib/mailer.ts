/**
 * Envoi d'emails transactionnels via l'API HTTP de Resend (aucune dépendance).
 *
 * Configuration (variables d'environnement) :
 *   RESEND_API_KEY   — clé API Resend (https://resend.com). Sans elle, les emails
 *                      ne sont pas envoyés mais les demandes restent enregistrées en base.
 *   MAIL_FROM        — expéditeur, ex. "FuturCraft Institut <notifications@futurcraft.bj>"
 *                      (le domaine doit être vérifié chez Resend).
 *   MAIL_TO          — boîte(s) qui reçoivent les demandes, séparées par des virgules.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const DEFAULT_MAIL_TO = "contact@futurcraftinstitut.com";
export const DEFAULT_MAIL_FROM = "FuturCraft Institut <onboarding@resend.dev>";

export interface MailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export type MailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: "not-configured" | "error"; detail?: string };

export function isMailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function notificationRecipients(): string[] {
  return (process.env.MAIL_TO || DEFAULT_MAIL_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendMail(message: MailMessage): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not-configured" };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || DEFAULT_MAIL_FROM,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[mailer] Resend ${res.status}: ${detail.slice(0, 300)}`);
      return { sent: false, reason: "error", detail: `HTTP ${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, id: data.id };
  } catch (err) {
    console.error("[mailer] envoi impossible :", err);
    return { sent: false, reason: "error", detail: err instanceof Error ? err.message : String(err) };
  }
}

/* ------------------------------------------------------------------ */
/* Gabarits                                                            */
/* ------------------------------------------------------------------ */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Row {
  label: string;
  value: string;
}

/** Email interne (équipe) : tableau clé/valeur sobre, lisible sur mobile. */
export function renderInternalEmail(opts: { heading: string; intro?: string; rows: Row[]; footer?: string }) {
  const rows = opts.rows
    .filter((r) => r.value && r.value.trim().length > 0)
    .map(
      (r) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e6e6e1;font:600 11px/1.4 Inter,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;vertical-align:top;width:34%">${escapeHtml(r.label)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e6e6e1;font:400 14px/1.6 Inter,Arial,sans-serif;color:#0b0f1a;white-space:pre-wrap">${escapeHtml(r.value)}</td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f2;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #0b0f1a">
    <tr><td style="background:#0b0f1a;padding:18px 22px">
      <span style="font:800 18px/1 Inter,Arial,sans-serif;color:#f5f5f2;letter-spacing:-.01em">FuturCraft Institut</span>
      <span style="font:600 11px/1 Inter,Arial,sans-serif;color:#5dcad6;letter-spacing:.14em;text-transform:uppercase;margin-left:12px">Site web</span>
    </td></tr>
    <tr><td style="padding:22px 22px 6px">
      <h1 style="margin:0;font:800 22px/1.2 Inter,Arial,sans-serif;color:#0b0f1a">${escapeHtml(opts.heading)}</h1>
      ${opts.intro ? `<p style="margin:10px 0 0;font:400 14px/1.6 Inter,Arial,sans-serif;color:#4b5563">${escapeHtml(opts.intro)}</p>` : ""}
    </td></tr>
    <tr><td style="padding:12px 8px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
    ${opts.footer ? `<tr><td style="padding:0 22px 22px;font:400 12px/1.6 Inter,Arial,sans-serif;color:#6b7280">${escapeHtml(opts.footer)}</td></tr>` : ""}
  </table>
</body></html>`;

  const text = [opts.heading, opts.intro ?? "", "", ...opts.rows.map((r) => `${r.label} : ${r.value}`), "", opts.footer ?? ""]
    .join("\n")
    .trim();

  return { html, text };
}

/** Accusé de réception envoyé au visiteur. */
export function renderAcknowledgementEmail(opts: { firstName: string; title: string; body: string[]; cta?: { label: string; url: string } }) {
  const paragraphs = opts.body
    .map((p) => `<p style="margin:0 0 14px;font:400 15px/1.7 Inter,Arial,sans-serif;color:#1f2937">${escapeHtml(p)}</p>`)
    .join("");
  const cta = opts.cta
    ? `<p style="margin:22px 0 0"><a href="${escapeHtml(opts.cta.url)}" style="display:inline-block;background:#2e58a5;color:#ffffff;text-decoration:none;font:700 14px/1 Inter,Arial,sans-serif;padding:14px 22px;border-radius:999px">${escapeHtml(opts.cta.label)}</a></p>`
    : "";

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f2;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #0b0f1a">
    <tr><td style="background:#0b0f1a;padding:18px 22px">
      <span style="font:800 18px/1 Inter,Arial,sans-serif;color:#f5f5f2">FuturCraft Institut</span>
    </td></tr>
    <tr><td style="padding:26px 22px">
      <p style="margin:0 0 6px;font:600 11px/1 Inter,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#2e58a5">Bonjour ${escapeHtml(opts.firstName)}</p>
      <h1 style="margin:0 0 18px;font:800 24px/1.2 Inter,Arial,sans-serif;color:#0b0f1a">${escapeHtml(opts.title)}</h1>
      ${paragraphs}
      ${cta}
    </td></tr>
    <tr><td style="padding:0 22px 22px;font:400 12px/1.6 Inter,Arial,sans-serif;color:#6b7280">
      FuturCraft Institut — Godomey, Supermarché O Bénin, avant PK14, Cotonou (Bénin)<br>
      +229 43 32 78 32 · contact@futurcraftinstitut.com
    </td></tr>
  </table>
</body></html>`;

  const text = [`Bonjour ${opts.firstName},`, "", opts.title, "", ...opts.body, opts.cta ? `\n${opts.cta.label} : ${opts.cta.url}` : ""].join("\n").trim();
  return { html, text };
}
