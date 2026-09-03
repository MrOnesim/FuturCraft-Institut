/**
 * Les dates du contenu (articles, événements, sessions) sont stockées sous forme
 * de texte français lisible (« 25 - 27 Avril 2025 », « 10 Février 2025 »).
 * Ces helpers en extraient des dates ISO pour les métadonnées et le JSON-LD.
 */

const MONTHS: Record<string, number> = {
  janvier: 1,
  fevrier: 2,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  aout: 8,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  decembre: 12,
  décembre: 12,
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * « 10 Février 2025 » → « 2025-02-10 ». Retourne `undefined` si non reconnu.
 */
export function parseFrenchDate(text: string): string | undefined {
  const m = text
    .toLowerCase()
    .match(/(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/);
  if (!m) return undefined;
  const month = MONTHS[m[2]];
  if (!month) return undefined;
  return `${m[3]}-${pad(month)}-${pad(Number(m[1]))}`;
}

/**
 * Plage de dates : « 25 - 27 Avril 2025 » → { start: 2025-04-25, end: 2025-04-27 } ;
 * « 12 Mai 2025 » → { start: 2025-05-12, end: 2025-05-12 }.
 */
export function parseFrenchDateRange(text: string): { start?: string; end?: string } {
  const lower = text.toLowerCase();
  const range = lower.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/);
  if (range) {
    const month = MONTHS[range[3]];
    if (month) {
      return {
        start: `${range[4]}-${pad(month)}-${pad(Number(range[1]))}`,
        end: `${range[4]}-${pad(month)}-${pad(Number(range[2]))}`,
      };
    }
  }
  const single = parseFrenchDate(text);
  return { start: single, end: single };
}

/** Vrai si la date (ISO `YYYY-MM-DD`) est déjà passée (fin de journée incluse). */
export function isPastIso(iso?: string): boolean {
  if (!iso) return false;
  const end = new Date(`${iso}T23:59:59`);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
}
