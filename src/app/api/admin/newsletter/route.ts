import { NextResponse } from "next/server";
import { getNewsletterSubscribers } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Liste des abonnés ; `?format=csv` pour un export tableur. */
export async function GET(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const rows = await getNewsletterSubscribers();
    const url = new URL(req.url);
    if (url.searchParams.get("format") === "csv") {
      const lines = ["email;source;inscrit_le;desinscrit_le"];
      for (const r of rows) {
        lines.push(
          [r.email, r.source ?? "", r.createdAt.toISOString(), r.unsubscribedAt?.toISOString() ?? ""]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(";")
        );
      }
      return new NextResponse(`\uFEFF${lines.join("\n")}`, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="newsletter-futurcraft-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/admin/newsletter error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
