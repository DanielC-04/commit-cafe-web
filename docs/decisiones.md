# Decisiones del proyecto

Registro corto de decisiones y su porqué. La más nueva va arriba.

## 2026-11-20 · Fase 0

- **Astro 7.4.7 y TypeScript 6.** `@astrojs/check` todavía no admite TypeScript 7. Cuando lo admita, se actualiza.
- **pnpm con `minimumReleaseAge: 20160`.** Aplica sola la regla de no instalar versiones de menos de 14 días. Por eso no tenemos el último parche de cada paquete, y está bien así.
- **Fuentes con la API de Astro (proveedor Fontsource).** En vez de instalar paquetes `@fontsource-variable/*`, Astro descarga las fuentes en el build, las sirve desde nuestro dominio, precarga solo Outfit y Figtree y genera fuentes de respaldo con métricas parecidas para evitar saltos de texto.
- **Títulos: Outfit vs Nunito → [POR COMPLETAR].** Las dos están cargadas en la página de prueba. Cuando elijas una, se cambia `--fuente-titulos` en `tokens.css` y se borra la otra de `astro.config.mjs`.
- **CSP en dos partes.** Astro pone una `<meta>` con hashes de scripts y estilos; `public/_headers` añade lo que una `<meta>` no puede (`frame-ancestors`, etc.). Consecuencia: no se pueden usar `style="..."` ni `onclick`.
- **Solo tema oscuro.** `color-scheme: dark` en `:root`. La Pizarra cambia a `color-scheme: light` con la clase `.pizarra`.
- **`SITE_URL`.** La URL pública se define como variable de entorno en el hosting. Sin ella, el build usa `http://localhost:4321` (solo sirve en local).
- **Taza viva.** `TazaViva.astro` lee `icono.svg` en el build y separa las 3 volutas de vapor para animarlas. No hay JavaScript en el navegador.
- **Hosting: Cloudflare.** Pendiente de crear la cuenta y conectar el repositorio de GitHub.
- **`compressHTML: true`.** Astro 7 usa por defecto reglas de espacios tipo JSX que se comían el espacio antes de `<code>` o `<a>` cuando Prettier partía la línea. Con `true` comprime sin perder espacios.
- **Override de `@emnapi/runtime` a 1.11.3** (`pnpm-workspace.yaml`). pnpm elegía una beta 2.0 incompatible y `astro check` fallaba. Revisar al actualizar `@astrojs/check`.
