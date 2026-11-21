/*
  Loader de Astro para los videos de YouTube (spec 5).

  En cada build lee el feed público del canal (formato Atom, los últimos
  15 videos) y guarda cada video como una entrada de la colección "videos".
  - Sin channelId configurado: no carga nada (la colección queda vacía).
  - Si el feed falla (sin internet, YouTube caído): NO borra lo que ya
    había y solo avisa en consola, así el build nunca se rompe por esto.
  - Los Shorts se reconocen porque su enlace usa /shorts/.

  No usa librerías: el feed es simple y lo leemos con expresiones regulares.
*/
import type { Loader } from "astro/loaders";

const FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=";

/** Convierte las entidades XML (&amp; &lt; …) en sus caracteres. */
function decodeXml(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

/** Devuelve el contenido de la primera etiqueta <tag>…</tag>. */
function tag(xml: string, name: string): string | undefined {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match?.[1] ? decodeXml(match[1].trim()) : undefined;
}

/** Devuelve el valor de un atributo de la primera etiqueta <tag …/>. */
function attr(
  xml: string,
  name: string,
  attribute: string,
): string | undefined {
  const match = xml.match(new RegExp(`<${name}[^>]*\\s${attribute}="([^"]*)"`));
  return match?.[1] ? decodeXml(match[1]) : undefined;
}

/** Primera línea útil de la descripción, como resumen corto. */
function resumen(description: string): string {
  const linea = description.split("\n").find((l) => l.trim().length > 0) ?? "";
  return linea.length > 200 ? `${linea.slice(0, 197)}…` : linea;
}

export function youtubeLoader({
  channelId,
}: {
  channelId: string | null;
}): Loader {
  return {
    name: "youtube-loader",
    async load({ store, logger, parseData, generateDigest }) {
      if (!channelId) {
        logger.info(
          "Sin youtubeChannelId en src/site.ts: no se cargan videos.",
        );
        store.clear();
        return;
      }

      let xml: string;
      try {
        const response = await fetch(FEED_URL + channelId, {
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        xml = await response.text();
      } catch (error) {
        logger.warn(
          `No se pudo leer el feed de YouTube (${String(error)}). Se mantienen los videos de la última vez.`,
        );
        return;
      }

      const entries = xml.split("<entry>").slice(1);
      store.clear();

      for (const entry of entries) {
        const id = tag(entry, "yt:videoId");
        const url = attr(entry, "link", "href");
        if (!id || !url) continue;

        const raw = {
          title: tag(entry, "title") ?? id,
          summary: resumen(tag(entry, "media:description") ?? ""),
          url,
          kind: url.includes("/shorts/") ? "short" : "video",
          publishedAt: tag(entry, "published") ?? new Date().toISOString(),
          thumbnail:
            attr(entry, "media:thumbnail", "url") ??
            `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };

        const data = await parseData({ id, data: raw });
        store.set({ id, data, digest: generateDigest(raw) });
      }

      logger.info(`${entries.length} videos leídos del feed de YouTube.`);
    },
  };
}
