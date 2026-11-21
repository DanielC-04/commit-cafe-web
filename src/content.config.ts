/*
  Colecciones de contenido (spec 5). Cada colección es una carpeta en
  src/content/ y cada archivo es una entrada. Zod valida los datos al
  compilar: si falta un campo o tiene un valor raro, el build falla y dice
  en qué archivo. El nombre del archivo es el id (y la URL): mi-api.mdx.

  Guía para la persona: docs/como-publicar.md
*/
import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";
import { youtubeLoader } from "./lib/youtube-loader";
import { SITE } from "./site";

/** Campos que comparten todas las entradas publicables. */
const base = {
  /** true = borrador: no se publica. */
  draft: z.boolean().default(false),
  /** Fecha de publicación (AAAA-MM-DD). Ordena el log. */
  publishedAt: z.coerce.date(),
  tags: z.array(z.string().toLowerCase()).default([]),
};

const plataforma = z.enum(["youtube", "tiktok", "instagram", "web"]);

/** Proyectos del Taller: un relato poco técnico por proyecto. */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      ...base,
      title: z.string(),
      /** Una frase, sin tecnicismos. */
      tagline: z.string().max(140),
      status: z.enum(["idea", "building", "shipped", "paused", "broken"]),
      startedAt: z.coerce.date(),
      stack: z.array(z.string()).default([]),
      links: z.object({
        repo: z.url(),
        demo: z.url().optional(),
        video: z.url().optional(),
      }),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

/** Bitácora corta de cada proyecto. Se muestra dentro de su página. */
const devlog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/devlog" }),
  schema: z.object({
    ...base,
    project: reference("projects"),
    title: z.string(),
  }),
});

/** Roturas: qué se rompió, por qué y cómo se arregló (fase 2). */
const breaks = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/breaks" }),
  schema: z.object({
    ...base,
    title: z.string(),
    summary: z.string().max(200),
    project: reference("projects").optional(),
    severity: z.enum(["susto", "caída", "desastre"]),
  }),
});

/** Lo que no tiene colección propia: TikTok, Instagram y notas sueltas. */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z
    .object({
      ...base,
      title: z.string(),
      summary: z.string().max(200),
      kind: z.enum(["short", "note"]),
      platform: plataforma,
      /** Enlace externo (obligatorio si la plataforma no es "web"). */
      url: z.url().optional(),
      project: reference("projects").optional(),
    })
    .refine((p) => p.platform === "web" || p.url, {
      message: 'Si la plataforma no es "web", falta el campo url.',
      path: ["url"],
    }),
});

/** Videos de YouTube, leídos del feed del canal en cada build. */
const videos = defineCollection({
  loader: youtubeLoader({ channelId: SITE.youtubeChannelId }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    url: z.url(),
    kind: z.enum(["video", "short"]),
    publishedAt: z.coerce.date(),
    thumbnail: z.url(),
  }),
});

/** Estado "Ahora" de la columna fija. Un solo archivo: src/content/now.json */
const now = defineCollection({
  loader: file("./src/content/now.json"),
  schema: z.object({
    /** Qué se está construyendo ahora, en una frase. */
    building: z.string().nullable(),
    /** Último commit o avance, en una frase. */
    lastCommit: z.string().nullable(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { projects, devlog, breaks, posts, videos, now };
