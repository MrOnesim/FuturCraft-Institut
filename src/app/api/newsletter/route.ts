import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { subscribeNewsletter } from "@/lib/data-service";
import { notificationRecipients, renderAcknowledgementEmail, sendMail } from "@/lib/mailer";
import { absoluteUrl } from "@/lib/site";
import { EMAIL_RE, cleanText, clientIp, rateLimit } from "@/lib/request-guard";

export const dynamic = "force-dynamic";

/** Inscription à la newsletter / demande de brochure. Idempotent par adresse. */
export async function POST(req: NextRequest) {
  const limited = rateLimit(`newsletter:${clientIp(req)}`, 8, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const email = cleanText(body.email, 160).toLowerCase();
  const source = cleanText(body.source, 120);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Veuillez saisir une adresse email valide." }, { status: 400 });
  }

  try {
    const subscriber = await subscribeNewsletter(email, source || null);

    after(async () => {
      const ack = renderAcknowledgementEmail({
        firstName: "et bienvenue",
        title: "Votre brochure FuturCraft arrive.",
        body: [
          "Vous recevrez une fois par mois nos actualités : nouvelles sessions, événements du campus et tendances tech en Afrique.",
          "En attendant, retrouvez dès maintenant les programmes détaillés, le calendrier des sessions et la grille tarifaire complète sur le site.",
        ],
        cta: { label: "Consulter les formations et tarifs", url: absoluteUrl("/admissions") },
      });
      await sendMail({
        to: subscriber.email,
        subject: "Bienvenue dans la newsletter FuturCraft Institut",
        html: ack.html,
        text: ack.text,
        replyTo: notificationRecipients()[0],
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/newsletter error:", error);
    return NextResponse.json({ error: "Inscription impossible pour le moment. Réessayez dans un instant." }, { status: 500 });
  }
}
