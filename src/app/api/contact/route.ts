import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { saveContactMessage } from "@/lib/data-service";
import {
  notificationRecipients,
  renderAcknowledgementEmail,
  renderInternalEmail,
  sendMail,
} from "@/lib/mailer";
import { absoluteUrl } from "@/lib/site";
import { EMAIL_RE, cleanMultiline, cleanText, clientIp, isValidPhone, rateLimit } from "@/lib/request-guard";

export const dynamic = "force-dynamic";

/**
 * Réception des demandes du site (formulaire de contact, inscription à un
 * événement). La demande est TOUJOURS enregistrée en base ; l'email n'est
 * qu'une notification en plus (envoyée après la réponse, sans la ralentir).
 */
export async function POST(req: NextRequest) {
  const limited = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ « pot de miel » : rempli uniquement par les robots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 160).toLowerCase();
  const phone = cleanText(body.phone, 40);
  const subject = cleanText(body.subject, 120);
  const context = cleanText(body.context, 200);
  const message = cleanMultiline(body.message, 4000);
  const source = cleanText(body.source, 200);
  const kind = body.kind === "event" ? "event" : "contact";

  if (name.length < 2) return NextResponse.json({ error: "Merci d'indiquer votre nom." }, { status: 400 });
  if (!isValidPhone(phone)) return NextResponse.json({ error: "Merci d'indiquer un numéro de téléphone valide." }, { status: 400 });
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "L'adresse email semble invalide." }, { status: 400 });
  if (kind === "contact" && !email) return NextResponse.json({ error: "Merci d'indiquer votre adresse email." }, { status: 400 });
  if (kind === "contact" && message.length < 10) {
    return NextResponse.json({ error: "Votre message est un peu court : dites-nous en plus." }, { status: 400 });
  }
  if (!subject) return NextResponse.json({ error: "Merci de préciser l'objet de votre demande." }, { status: 400 });

  try {
    const saved = await saveContactMessage({
      name,
      email: email || null,
      phone,
      subject,
      context: context || null,
      message: message || (kind === "event" ? `Inscription à l'événement « ${context} »` : ""),
      source: source || null,
    });

    // Notifications (équipe + accusé de réception) après l'envoi de la réponse.
    after(async () => {
      const receivedAt = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Africa/Porto-Novo",
      }).format(saved.createdAt);

      const internal = renderInternalEmail({
        heading: kind === "event" ? `Inscription événement : ${context || subject}` : `Nouveau message : ${subject}`,
        intro: `Reçu le ${receivedAt} via ${source || "le site"}. Répondez directement à cet email pour contacter la personne.`,
        rows: [
          { label: "Nom", value: name },
          { label: "Téléphone", value: phone },
          { label: "Email", value: email },
          { label: "Objet", value: subject },
          { label: "Contexte", value: context },
          { label: "Message", value: saved.message },
        ],
        footer: `Référence interne n° ${saved.id}. Cette demande est aussi consultable dans la console d'administration, onglet « Demandes ».`,
      });

      await sendMail({
        to: notificationRecipients(),
        subject: `[Site] ${kind === "event" ? "Inscription" : "Contact"} — ${name} · ${context || subject}`,
        html: internal.html,
        text: internal.text,
        replyTo: email || undefined,
      });

      if (email) {
        const firstName = name.split(/\s+/)[0] || name;
        const ack =
          kind === "event"
            ? renderAcknowledgementEmail({
                firstName,
                title: "Votre place est réservée.",
                body: [
                  `Nous avons bien enregistré votre inscription à « ${context || subject} ».`,
                  "Un membre de l'équipe vous confirmera les détails pratiques (horaires, accès au campus) par WhatsApp ou par téléphone.",
                ],
                cta: { label: "Voir le programme des événements", url: absoluteUrl("/vie-a-futurcraft") },
              })
            : renderAcknowledgementEmail({
                firstName,
                title: "Nous avons bien reçu votre message.",
                body: [
                  `Merci de votre intérêt pour FuturCraft Institut. Votre demande concernant « ${subject} » a été transmise à un conseiller d'orientation.`,
                  "Nous vous répondons sous 24 h ouvrées. Pour une réponse immédiate, vous pouvez aussi nous écrire sur WhatsApp au +229 43 32 78 32.",
                ],
                cta: { label: "Découvrir les formations", url: absoluteUrl("/formations") },
              });

        await sendMail({
          to: email,
          subject: kind === "event" ? `Inscription confirmée — ${context || subject}` : "Nous avons bien reçu votre message",
          html: ack.html,
          text: ack.text,
          replyTo: notificationRecipients()[0],
        });
      }
    });

    return NextResponse.json({ success: true, id: saved.id });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre demande pour le moment. Écrivez-nous sur WhatsApp au +229 43 32 78 32." },
      { status: 500 }
    );
  }
}
