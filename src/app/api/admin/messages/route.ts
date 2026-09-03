import { NextResponse } from "next/server";
import { getContactMessages } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    return NextResponse.json(await getContactMessages());
  } catch (error) {
    console.error("GET /api/admin/messages error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
