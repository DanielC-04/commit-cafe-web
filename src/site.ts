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
  email: "danielcc.dev@gmail.com" as string | null,
  /**
    Handle único en redes, sin @. Hoy no es el mismo en todas
    (TikTok: commitcafe7, Instagram: commitandcafe), así que queda en null.
  */
  handle: null as string | null,

  /** ID del canal de YouTube (empieza por "UC"). Activa el feed de videos. */
  youtubeChannelId: "UCXHQ-YgUsq2VHAaLa_WeHsg" as string | null,

  /**
    Enlaces a los canales (sin los parámetros de rastreo que añaden las
    apps al compartir, como ?_r= o ?knvt=). Los que estén en null no se
    muestran.
  */
  social: {
    youtube: "https://www.youtube.com/channel/UCXHQ-YgUsq2VHAaLa_WeHsg" as
      string | null,
    tiktok: "https://www.tiktok.com/@commitcafe7" as string | null,
    instagram: "https://www.instagram.com/commitandcafe/" as string | null,
    github: "https://github.com/DanielC-04" as string | null,
  },
};

export type SocialKey = keyof typeof SITE.social;
