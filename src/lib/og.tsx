import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Rendu des images de partage (Open Graph / Twitter) dans le style éditorial
 * du site : fond encre, très grand titre, mot d'accent en serif italique cyan,
 * monogramme et coordonnées du campus.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0b0f1a";
const PAPER = "#f5f5f2";
const ACCENT = "#5dcad6";
const BRAND = "#2e58a5";

const fontsDir = join(process.cwd(), "src/assets/fonts");

// Lus une seule fois par instance (les polices ne dépendent pas de la requête).
const assets = Promise.all([
  readFile(join(fontsDir, "bricolage-grotesque-latin-800-normal.woff")),
  readFile(join(fontsDir, "inter-latin-500-normal.woff")),
  readFile(join(fontsDir, "instrument-serif-latin-400-italic.woff")),
  readFile(join(process.cwd(), "public/images/logo-mark.png")).then((b) => `data:image/png;base64,${b.toString("base64")}`),
]);

export interface OgCardProps {
  /** Petit libellé en capitales au-dessus du titre (ex. « Formation · 9 mois »). */
  eyebrow: string;
  /** Titre principal (2 lignes max recommandées). */
  title: string;
  /** Mot ou groupe de mots rendu en serif italique cyan, après le titre. */
  accent?: string;
  /** Ligne de description sous le titre. */
  description?: string;
  /** Pastilles d'information en bas (ex. prix, durée, campus). */
  chips?: string[];
  /** Image de fond optionnelle (URL absolue ou data URL), assombrie. */
  backgroundImage?: string;
}

/** Tronque proprement un texte pour tenir dans la carte. */
export function clamp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20))}…`;
}

export async function renderOgCard(props: OgCardProps): Promise<ImageResponse> {
  const [display, sans, serif, logo] = await assets;
  const titleLength = props.title.length + (props.accent?.length ?? 0);
  const titleSize = titleLength > 70 ? 54 : titleLength > 46 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          color: PAPER,
          position: "relative",
          fontFamily: "Inter",
        }}
      >
        {props.backgroundImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={props.backgroundImage}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.28 }}
          />
        )}
        {/* Dégradé pour la lisibilité */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, ${INK} 38%, rgba(11,15,26,0.55) 100%)`,
          }}
        />

        {/* Bande supérieure */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "44px 64px 0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={46} height={49} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Bricolage", fontSize: 30, letterSpacing: -0.8, lineHeight: 1 }}>FuturCraft</span>
              <span style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: ACCENT, marginTop: 6 }}>
                Institut
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(245,245,242,0.7)",
            }}
          >
            <span style={{ width: 10, height: 10, background: ACCENT, display: "flex" }} />
            {clamp(props.eyebrow, 48)}
          </div>
        </div>

        {/* Titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flex: 1,
            padding: "0 64px 40px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontFamily: "Bricolage",
              fontSize: titleSize,
              lineHeight: 1.02,
              letterSpacing: -2.2,
              maxWidth: 1040,
            }}
          >
            <span>{clamp(props.title, 90)}</span>
            {props.accent && (
              <span style={{ fontFamily: "Instrument", fontStyle: "italic", color: ACCENT, marginLeft: 18, letterSpacing: -1 }}>
                {clamp(props.accent, 40)}
              </span>
            )}
          </div>
          {props.description && (
            <div
              style={{
                marginTop: 22,
                fontSize: 24,
                lineHeight: 1.4,
                color: "rgba(245,245,242,0.72)",
                maxWidth: 900,
              }}
            >
              {clamp(props.description, 150)}
            </div>
          )}
        </div>

        {/* Pied : pastilles + campus */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245,245,242,0.18)",
            margin: "0 64px",
            padding: "22px 0 40px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {(props.chips ?? []).slice(0, 3).map((chip, i) => (
              <span
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: 999,
                  fontSize: 17,
                  fontWeight: 500,
                  background: i === 0 ? ACCENT : "transparent",
                  color: i === 0 ? INK : PAPER,
                  border: `1px solid ${i === 0 ? ACCENT : "rgba(245,245,242,0.4)"}`,
                }}
              >
                {clamp(chip, 32)}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 17, color: "rgba(245,245,242,0.6)" }}>Godomey · Cotonou, Bénin</span>
        </div>

        {/* Filet de marque */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: BRAND, display: "flex" }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "Inter", data: sans, weight: 500, style: "normal" },
        { name: "Instrument", data: serif, weight: 400, style: "italic" },
      ],
    }
  );
}

/** Charge une image locale de `public/` en data URL pour la passer à Satori. */
export async function publicImageDataUrl(publicPath: string): Promise<string | undefined> {
  if (!publicPath.startsWith("/")) return undefined;
  try {
    const file = await readFile(join(process.cwd(), "public", publicPath));
    const ext = publicPath.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${file.toString("base64")}`;
  } catch {
    return undefined;
  }
}
