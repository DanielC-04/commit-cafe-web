/*
  El log: el `git log` del estudio (spec 1 y 5).

  No es una colección: se CALCULA juntando todo lo publicado (proyectos,
  devlog, roturas, posts y videos de YouTube). Así cada cosa se escribe una
  sola vez y aparece sola en el log, ordenada de lo más nuevo a lo más viejo.
*/
import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "../site";

export type LogKind =
  "video" | "short" | "project" | "devlog" | "break" | "note";
export type LogPlatform = "youtube" | "tiktok" | "instagram" | "web";

export interface LogEntry {
  /** Identificador único en todo el log: "coleccion/id". */
  key: string;
  /** 7 caracteres que imitan el hash de un commit. */
  hash: string;
  title: string;
  summary: string;
  kind: LogKind;
  platform: LogPlatform;
  /** Ruta interna (/taller/mi-api) o URL externa (https://…). */
  url: string;
  external: boolean;
  tags: string[];
  /** id del proyecto relacionado, si lo hay. */
  project?: string;
  publishedAt: Date;
}

/** Nombres en español para mostrar cada tipo (y su ruta de filtro). */
export const KIND_LABELS: Record<LogKind, string> = {
  video: "Video",
  short: "Short",
  project: "Proyecto",
  devlog: "Devlog",
  break: "Rotura",
  note: "Nota",
};

/**
  Hash corto y estable a partir de un texto (FNV-1a de 32 bits).
  No es seguridad: solo un "aspecto de commit" que no cambia entre builds.
*/
export function shortHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

/** Los borradores solo se ven en `pnpm dev`, nunca en el sitio publicado. */
export function isPublished(entry: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}

function makeEntry(
  collection: string,
  id: string,
  fields: Omit<LogEntry, "key" | "hash" | "external">,
): LogEntry {
  const key = `${collection}/${id}`;
  return {
    key,
    hash: shortHash(key),
    external: /^https?:\/\//.test(fields.url),
    ...fields,
  };
}

const fromProject = (p: CollectionEntry<"projects">) =>
  makeEntry("projects", p.id, {
    title: p.data.title,
    summary: p.data.tagline,
    kind: "project",
    platform: "web",
    url: `/taller/${p.id}`,
    tags: p.data.tags,
    project: p.id,
    publishedAt: p.data.publishedAt,
  });

const fromDevlog = (d: CollectionEntry<"devlog">) =>
  makeEntry("devlog", d.id, {
    title: d.data.title,
    summary: "",
    kind: "devlog",
    platform: "web",
    url: `/taller/${d.data.project.id}#${d.id}`,
    tags: d.data.tags,
    project: d.data.project.id,
    publishedAt: d.data.publishedAt,
  });

const fromBreak = (b: CollectionEntry<"breaks">) =>
  makeEntry("breaks", b.id, {
    title: b.data.title,
    summary: b.data.summary,
    kind: "break",
    platform: "web",
    url: `/roturas#${b.id}`,
    tags: b.data.tags,
    project: b.data.project?.id,
    publishedAt: b.data.publishedAt,
  });

const fromPost = (p: CollectionEntry<"posts">) =>
  makeEntry("posts", p.id, {
    title: p.data.title,
    summary: p.data.summary,
    kind: p.data.kind,
    platform: p.data.platform,
    url: p.data.platform === "web" ? `/notas/${p.id}` : (p.data.url ?? "/"),
    tags: p.data.tags,
    project: p.data.project?.id,
    publishedAt: p.data.publishedAt,
  });

const fromVideo = (v: CollectionEntry<"videos">) =>
  makeEntry("videos", v.id, {
    title: v.data.title,
    summary: v.data.summary,
    kind: v.data.kind,
    platform: "youtube",
    url: v.data.url,
    tags: [],
    publishedAt: v.data.publishedAt,
  });

/*
  En el build el contenido no cambia, así que el log se calcula una sola
  vez y se reutiliza en todas las páginas. En `pnpm dev` se recalcula
  siempre para ver los cambios al guardar.
*/
let cache: Promise<LogEntry[]> | undefined;

/** Todo el log, de lo más nuevo a lo más viejo. */
export function getLog(): Promise<LogEntry[]> {
  if (import.meta.env.DEV) return calcularLog();
  cache ??= calcularLog();
  return cache;
}

async function calcularLog(): Promise<LogEntry[]> {
  const [projects, devlog, breaks, posts, videos] = await Promise.all([
    getCollection("projects", isPublished),
    getCollection("devlog", isPublished),
    getCollection("breaks", isPublished),
    getCollection("posts", isPublished),
    // Sin canal configurado la colección está vacía: no se consulta (evita avisos).
    SITE.youtubeChannelId ? getCollection("videos") : Promise.resolve([]),
  ]);

  return [
    ...projects.map(fromProject),
    ...devlog.map(fromDevlog),
    ...breaks.map(fromBreak),
    ...posts.map(fromPost),
    ...videos.map(fromVideo),
  ].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

/** Tipos y etiquetas que tienen al menos una entrada (para los filtros). */
export function facets(log: LogEntry[]) {
  const kinds = [...new Set(log.map((e) => e.kind))];
  const tags = [...new Set(log.flatMap((e) => e.tags))].sort();
  return { kinds, tags };
}
