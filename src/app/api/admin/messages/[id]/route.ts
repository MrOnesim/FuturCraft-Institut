import { NextRequest, NextResponse } from "next/server";
import { setContactMessageStatus } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });

  try {
    const body = await req.json().catch(() => ({}));
    const status = body?.status === "traite" ? "traite" : "nouveau";
    const row = await setContactMessageStatus(numericId, status);
    if (!row) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    return NextResponse.json(row);
  } catch (error) {
    console.error("PATCH /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
