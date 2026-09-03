import { sql } from "drizzle-orm";
import { db } from "./index";

/**
 * Filet de sécurité pour les déploiements où `drizzle-kit migrate` n'a pas été
 * relancé : crée les tables ajoutées après la mise en production si elles
 * manquent. Strictement identique à `drizzle/0001_leads_newsletter.sql`
 * (idempotent : `IF NOT EXISTS`).
 */
export async function ensureLeadTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text,
      "phone" text NOT NULL,
      "subject" text NOT NULL,
      "context" text,
      "message" text NOT NULL,
      "source" text,
      "status" text DEFAULT 'nouveau' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" text NOT NULL,
      "source" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "unsubscribed_at" timestamp,
      CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
    )
  `);
}
