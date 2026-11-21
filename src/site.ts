/*
  Datos del sitio y de la persona. Es el ÚNICO lugar donde van.
  Lo que todavía no existe queda en null y la web muestra [POR COMPLETAR]
  (o esconde el enlace), nunca un dato inventado. Spec 12.6 y 13.
*/

export const POR_COMPLETAR = "[POR COMPLETAR]";

export const SITE = {
  name: "Commit&Cafe",
  description:
    "El estudio de Commit&Cafe: videos, proyectos y notas sobre desarrollo de software, contados sin tecnicismos.",
  locale: "es",

  /** Nombre de la persona autora (para JSON-LD y la página Estudio). */
  author: null as string | null,
  /** Correo público de contacto. */
  email: null as string | null,
  /** Handle único en redes, sin @ (p. ej. "commitandcafe"). */
  handle: null as string | null,

  /** ID del canal de YouTube (empieza por "UC"). Activa el feed de videos. */
  youtubeChannelId: null as string | null,

  /** Enlaces a los canales. Los que estén en null no se muestran. */
  social: {
    youtube: null as string | null,
    tiktok: null as string | null,
    instagram: null as string | null,
    github: "https://github.com/DanielC-04" as string | null,
  },
};

export type SocialKey = keyof typeof SITE.social;
