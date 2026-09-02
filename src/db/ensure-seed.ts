import { db } from "./index";
import { formations } from "./schema";
import { count } from "drizzle-orm";
import { seedDatabase } from "./seed";
import { syncSeedMedia } from "./sync-media";

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const rows = await db.select({ c: count() }).from(formations);
        if (Number(rows[0]?.c ?? 0) === 0) {
          await seedDatabase();
        } else {
          // Base déjà peuplée (ex. production) : bascule des visuels externes
          // restants vers les images auto-hébergées, une seule fois par processus.
          const updated = await syncSeedMedia();
          if (updated > 0) console.log(`Media sync: ${updated} visuel(s) basculé(s) en local.`);
        }
      } catch (err) {
        console.error("Error checking seed:", err);
      }
    })();
  }
  await seedPromise;
}
