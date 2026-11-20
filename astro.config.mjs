// @ts-check
// Configuración principal de Astro. Cada bloque explica por qué existe.
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// La URL pública del sitio. Se usa para las URLs canónicas, el sitemap y
// Open Graph. Orden: SITE_URL (si la defines), luego URL (Netlify la pone
// sola en cada build con el dominio principal) y, en local, localhost.
const site = process.env.SITE_URL ?? process.env.URL ?? "http://localhost:4321";

export default defineConfig({
  site,
  // URLs sin barra final: /taller/mi-api (no /taller/mi-api/).
  trailingSlash: "never",
  build: { format: "file" },
  // Astro 7 aplica por defecto las reglas de espacios de JSX: borra el
  // espacio entre un texto y un <code> o <a> cuando Prettier los separa
  // en dos líneas ("comogit commit"). `true` comprime sin perder espacios.
  compressHTML: true,

  integrations: [mdx(), sitemap()],

  // Resaltado de código con Prism (clases CSS). Shiki usa estilos en línea
  // y la CSP los bloquearía.
  markdown: { syntaxHighlight: "prism" },

  // Fuentes: Astro las descarga de Fontsource durante el build y las sirve
  // desde nuestro propio dominio (privacidad), con preload y fuentes de
  // respaldo ajustadas para que el texto no "salte" al cargar (CLS).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      weights: ["400 800"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      // Candidata alternativa para títulos (fase 0: comparar con Outfit).
      provider: fontProviders.fontsource(),
      name: "Nunito",
      cssVariable: "--font-nunito",
      weights: ["400 800"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Figtree",
      cssVariable: "--font-figtree",
      weights: ["300 700"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      weights: ["400 700"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
  ],

  // Seguridad: Astro calcula un hash de cada script y estilo que genera y
  // lo pone en una <meta> CSP por página. Así el navegador solo ejecuta lo
  // que nosotros escribimos. Solo funciona en `build` + `preview`.
  security: {
    csp: true,
  },
});
