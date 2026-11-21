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

/** Convierte referencias escritas como rutas o nombres de archivo a ids Astro. */
const aIdDeProyecto = (valor: unknown) => {
  if (typeof valor !== "string") return valor;
  const nombre = valor.trim();
  if (!nombre) return undefined;
  return nombre
    .split(/[\\/]/)
    .at(-1)
    ?.replace(/\.mdx?$/i, "");
};

/** Una URL opcional: el panel guarda "" si se deja vacía; eso cuenta como ausente. */
const urlOpcional = z.preprocess(
  (valor) => (valor === "" ? undefined : valor),
  z.url().optional(),
);

/**
  Texto opcional: si el panel lo guarda vacío ("") se convierte en null.
*/
const textoONull = z.preprocess(
  (valor) => (typeof valor === "string" && !valor.trim() ? null : valor),
  z.string().nullable(),
);

/** Quita elementos vacíos que el panel puede dejar en una lista. */
const listaDeTexto = z.preprocess(
  (valor) =>
    Array.isArray(valor)
      ? valor.filter((item) => typeof item !== "string" || item.trim())
      : valor,
  z.array(z.string().trim()).default([]),
);

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
        demo: urlOpcional,
        video: urlOpcional,
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
    project: z.preprocess(aIdDeProyecto, reference("projects")),
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
    project: z.preprocess(aIdDeProyecto, reference("projects").optional()),
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
      url: urlOpcional,
      project: z.preprocess(aIdDeProyecto, reference("projects").optional()),
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
    building: textoONull,
    /** Último commit o avance, en una frase. */
    lastCommit: textoONull,
    updatedAt: z.coerce.date(),
  }),
});

/** Datos personales y listas de la página Estudio, editables desde el panel. */
const estudio = defineCollection({
  loader: file("./src/content/estudio.json"),
  schema: z.object({
    /** Nombre para la presentación y los datos estructurados del sitio. */
    nombre: textoONull,
    /** Presentación con párrafos separados por una línea en blanco. */
    presentacion: textoONull,
    /** Elementos del equipo de trabajo. */
    setup: listaDeTexto,
    /** Herramientas usadas en el día a día. */
    herramientas: listaDeTexto,
    /** Pasos del proceso para hacer un video. */
    proceso: listaDeTexto,
  }),
});

export const collections = {
  projects,
  devlog,
  breaks,
  posts,
  videos,
  now,
  estudio,
};
