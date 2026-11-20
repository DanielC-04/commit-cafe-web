# Commit&Cafe — Especificación de la web (para agente de programación)

**Versión 1.1 · 2026-11-20.** Esta copia dentro del repo es la fuente de verdad. Cambios respecto a la v1.0 al final, en la sección 15.

> Léelo completo antes de escribir código. Trabajas **junto a una persona**: estudiante de último año de desarrollo de software, con poca experiencia profesional. Explica cada decisión en lenguaje simple, haz cambios pequeños y evita la sobreingeniería.

## 1. Qué es esta web

El **estudio personal** del creador del canal Commit&Cafe (YouTube, TikTok e Instagram, en español, sobre desarrollo de software). No es un portafolio frío: es la mesa de trabajo donde se mezcla todo, y **crece conforme crece su autor**.

- Concepto: la web es el `git log` del estudio. Cada contenido nuevo (video, proyecto, pizarra, nota) es un "commit" en una línea de tiempo única.
- Los proyectos se cuentan como **relato poco técnico** (por qué, qué se rompió, qué aprendí) con enlace a GitHub, demo y video.
- Hoy casi no hay contenido. **Todo el diseño debe funcionar con 3 entradas y seguir funcionando con 300.**
- Idioma: español (`es`). Preparar la estructura para sumar inglés después, sin implementarlo ahora.
- Boceto visual de referencia: `Commit&Cafe — boceto web` (inicio de escritorio y página de proyecto). **[POR COMPLETAR]: guardar el boceto en `/docs/boceto/`.** Mientras no esté, la estructura sale de las secciones 6 y 7.

## 2. Principio de escalabilidad (lo más importante)

1. **El contenido son archivos** (Markdown/MDX + JSON) dentro del repo, validados con esquemas. Agregar un video o proyecto = agregar un archivo, sin tocar código.
2. **Secciones con "puerta de contenido":** una sección (Taller, Pizarra, Historia, Recursos…) aparece en la navegación y en el inicio **solo si su colección tiene al menos una entrada publicada**. Sin entradas no existe la ruta enlazada ni hay páginas vacías.
3. Las listas paginan o filtran solas al crecer. Nada de contenido escrito a mano en plantillas.
4. Cada fase (sección 11) deja el sitio **publicable**.

## 3. Stack

| Capa           | Elección                                                                                                                                                                       | Motivo                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Framework      | **Astro 7** (última estable con ≥ 14 días; verifica con `npm view astro version`)                                                                                              | Pensado para contenido, casi sin JS, excelente SEO                   |
| Lenguaje       | **TypeScript 6** estricto (la 7 aún no es compatible con `astro check`)                                                                                                        | Esquemas y errores claros                                            |
| Contenido      | **Astro Content Collections** + **Zod** + **MDX** (`@astrojs/mdx`)                                                                                                             | Contenido tipado y validado                                          |
| Estilos        | **CSS moderno propio** (custom properties, `@layer`, container queries). **Sin Tailwind**                                                                                      | Control total del diseño y menos dependencias                        |
| Interactividad | JS vanilla en islas mínimas; sin React salvo necesidad demostrada                                                                                                              | Rendimiento                                                          |
| Imágenes       | `astro:assets` (+ `sharp`)                                                                                                                                                     | AVIF/WebP, tamaños, lazy                                             |
| Fuentes        | **API de fuentes de Astro** con el proveedor Fontsource (`fontProviders.fontsource()`): descarga en el build y sirve desde nuestro dominio, con _preload_ y fallbacks métricos | Privacidad, rendimiento y CLS bajo                                   |
| Iconos         | `lucide` (interfaz) + `simple-icons` (YouTube, TikTok, Instagram, GitHub), como SVG en línea                                                                                   | Sin emojis ni librerías pesadas                                      |
| Búsqueda       | **Pagefind** (fase 4)                                                                                                                                                          | Estática, sin servidor                                               |
| Hosting        | **Cloudflare** (plan gratuito, sitio estático desplegado desde GitHub)                                                                                                         | Cabeceras con `_headers`, analítica y Turnstile en el mismo sitio    |
| Analítica      | **Cloudflare Web Analytics**                                                                                                                                                   | Sin cookies, gratis, mismo proveedor                                 |
| Gestor         | **`pnpm`** (versión fijada en `packageManager`), Node LTS actual (≥ 22.12)                                                                                                     | Lockfile obligatorio; `minimumReleaseAge` aplica la regla de 14 días |
| Calidad        | `astro check` (tipos y esquemas) + **Prettier** con `prettier-plugin-astro`                                                                                                    | Suficiente para un sitio de contenido; sin ESLint por ahora          |

Verifica los nombres exactos y versiones de cada paquete con `npm view` antes de instalarlos. No instales nada que no esté en esta lista sin justificarlo a la persona.

## 4. Estructura del repositorio

```
/public/brand/          logos del kit (icono.svg, completo.svg, horizontal.svg, monocromo*.svg), favicon, og-default
/src/content/           colecciones (ver sección 5)
/src/components/        piezas de interfaz reutilizables
/src/layouts/           BaseLayout, DeskLayout (columna fija + contenido)
/src/pages/             rutas
/src/styles/            tokens.css, base.css, utilities.css
/src/lib/               utilidades (feed de YouTube, fechas, filtros)
/src/content.config.ts  definición y esquemas de las colecciones
/docs/                  spec, brief de marca, boceto, decisiones, guía de contenido
AGENTS.md               reglas del proyecto (ver sección 12)
CLAUDE.md               importa AGENTS.md (Claude Code lee este archivo)
```

## 5. Modelo de contenido (colecciones)

Todas con `draft: boolean` (los borradores no se publican), `publishedAt: date` y `tags[]` opcional. El slug sale del **nombre del archivo** (Astro lo da como `id`); no se escribe a mano.

- **El log no es una colección: se calcula.** `src/lib/log.ts` junta todas las colecciones publicadas + los videos de YouTube y produce filas con: `title`, `summary`, `kind` (`video|short|project|devlog|break|board|note`), `platform` (`youtube|tiktok|instagram|web`), `url`, `hash` (7 caracteres derivados del id), `tags[]`, `project?`, `publishedAt`. Así cada contenido se escribe **una sola vez**.
- **`posts`** (lo que no tiene otra colección): `title`, `summary`, `kind` (`short|note`), `platform`, `url?` (para TikTok/Instagram cargados a mano), `project?`.
- **`projects`**: `title`, `tagline` (una frase sin tecnicismos), `status` (`idea|building|shipped|paused|broken`), `startedAt`, `stack[]`, `links { repo, demo?, video? }`, `cover?`, y el cuerpo en MDX con las secciones: Por qué lo hice / Qué se rompió / Qué aprendí.
- **`devlog`**: `project` (referencia), `title`, `publishedAt`, cuerpo corto. Aparece dentro de la página del proyecto.
- **`breaks`** (roturas; fase 2): `title`, `summary`, `project?`, `severity` (`susto|caída|desastre`), cuerpo con Qué pasó / Por qué / Cómo lo arreglé. Alimenta `/roturas` y el log.
- **`boards`** (pizarra): `concept`, `diagram` (SVG/imagen), `video?`, `cheatsheet?` (PDF).
- **`story`** (Mi historia): `publishedAt` (fecha del momento contado), `title`, `text`, `drawing?`. Es una secuencia real, así que se numera por fecha.
- **`now`** (archivo único): `building`, `lastCommit`, `updatedAt`. Alimenta el estado "Ahora" de la columna fija.
- **`resources`** (fase 4): `title`, `file`, `description`.

**Videos de YouTube:** una colección `videos` con un **loader propio de Astro** (`src/lib/youtube-loader.ts`) que en el build lee el feed RSS del canal (`https://www.youtube.com/feeds/videos.xml?channel_id=…`) y valida cada video con el mismo esquema Zod. Si el feed falla, el build **no** se rompe: usa los datos de la última vez y avisa en consola. Los Shorts se distinguen por la URL (`/shorts/`). TikTok e Instagram **se cargan a mano** (sus APIs son restrictivas). Reconstruir con un cron de GitHub Actions o un deploy hook. Verifica el formato del feed antes de implementarlo.

## 6. Páginas y navegación

| Ruta                                                             | Contenido                                                                                                         | Fase              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------- |
| `/`                                                              | Columna fija (taza, nombre, "Ahora", canales) + log + vistas previas de secciones activas                         | 1                 |
| `/log`, `/log/[page]`, `/log/tipo/[kind]`, `/log/etiqueta/[tag]` | Feed completo paginado; los filtros son **rutas estáticas** (cero JS). Un filtro solo se genera si tiene entradas | 1                 |
| `/taller` y `/taller/[slug]`                                     | Lista de proyectos y relato de cada uno                                                                           | 1 (plantilla) / 2 |
| `/estudio`                                                       | Quién soy, setup, herramientas, cómo hago un video                                                                | 1                 |
| `/contacto`                                                      | Correo (`mailto:`) y canales. Formulario solo en la fase 4 si hace falta                                          | 1                 |
| `/privacidad`                                                    | Qué se mide (analítica sin cookies), qué no, y a quién escribir                                                   | 1                 |
| `/roturas`                                                       | Post-mortems y bug de la semana                                                                                   | 2                 |
| `/pizarra` y `/pizarra/[slug]`                                   | Conceptos dibujados                                                                                               | 3                 |
| `/historia`                                                      | Draw my life interactivo                                                                                          | 3                 |
| `/recursos`, `/buscar`, `/rss.xml`                               | Descargas, búsqueda, feed                                                                                         | 4                 |
| `/404`                                                           | Útil: dice qué pasó y enlaza al log                                                                               | 1                 |

## 7. Sistema de diseño

**Principios:** un solo momento memorable (la taza viva de la columna fija); todo lo demás sobrio. Sin rejilla de tarjetas idénticas: el contenido va en **filas del log**. Sin etiquetas en mayúsculas sobre cada título. Sin numeración, salvo secuencias reales (historia, episodios). Sin emojis. Sin degradados decorativos. Movimiento solo cuando responde a una acción o para una única animación de entrada.

**Color** (marca; no agregar otros). Los dos derivados son solo para superficies y texto secundario:

| Token             | Hex       | Uso                                             |
| ----------------- | --------- | ----------------------------------------------- |
| `--carbon`        | `#1B1D1C` | Fondo                                           |
| `--carbon-alto`   | `#262928` | Superficies (derivado)                          |
| `--crema`         | `#F5E8D5` | Texto, símbolo                                  |
| `--crema-apagada` | `#B8AE9E` | Texto secundario (derivado)                     |
| `--naranja`       | `#E8913F` | Solo lo "vivo": vapor, estado, subrayados, foco |

Contrastes medidos (WCAG): crema/carbón 14,0 · crema/carbón-alto 12,2 · crema-apagada/carbón 7,7 · crema-apagada/carbón-alto 6,7 · naranja/carbón 6,9 · naranja/carbón-alto 6,0. Todos pasan AA.

Reglas: la sección **Pizarra** se invierte (fondo crema, tinta carbón, subrayado naranja). En crema **no sirven** ni el naranja (2,0:1) ni la crema-apagada (1,8:1), así que Pizarra usa sus propios derivados:

| Token             | Hex       | Uso                                                                      |
| ----------------- | --------- | ------------------------------------------------------------------------ |
| `--tinta-apagada` | `#5C5650` | Texto secundario sobre crema (derivado; 6,0:1, y 5,3:1 sobre crema-alta) |
| `--crema-alta`    | `#EADBC4` | Superficies sobre crema (derivado)                                       |

En Pizarra el **anillo de foco es carbón**, no naranja (WCAG 2.2 pide ≥ 3:1 para el foco). El naranja ahí solo decora (subrayados gruesos, formas). Tema oscuro por defecto (`color-scheme: dark`); modo claro, no en el inicio. Sobre crema se usa el logo `monocromo_oscuro.svg`.

**Tipografía:** títulos en una geométrica redondeada cercana al logo: **Outfit** o **Nunito** (el texto del logo tiene terminaciones redondeadas; se elige comparándolas en la página de prueba de la fase 0 y se anota en `docs/decisiones.md`); texto en una humanista distinta (**Figtree**); monoespaciada (**JetBrains Mono**) **solo para código real**: hashes, comandos, terminal. Pizarra: la letra manuscrita de la persona escaneada, o una fuente manuscrita como respaldo. Líneas de texto de menos de 80 caracteres.

**Maquetación:** escritorio con columna izquierda fija (~5/12) y contenido a la derecha (~7/12). En móvil, la columna fija se reduce a una cabecera con la taza y el estado, y el resto va en una sola columna.

**Logo y marca:** usar los SVG del kit (`/public/brand/`). Nunca deformar, rotar ni recolorear el `&`. Favicon desde `icono.svg` (`favicon.svg`, `favicon.ico` 32 px, `apple-touch-icon.png` 180 px) y `og-default.png` 1200×630. La "taza viva" anima solo el vapor (trazo naranja separado en `icono.svg`), nunca la forma del `&`. Bajo 150 px, solo el ícono sin texto. Nombre siempre **Commit&Cafe**.

## 8. SEO

- `<title>` y `meta description` únicos por página; URL canónica; `lang="es"`.
- **Open Graph / Twitter Cards** con imagen por página (generada en build con `astro-og-canvas` o `satori`, con el logo y la paleta).
- **JSON-LD:** `WebSite` y `Person` en el inicio; `VideoObject` para videos; `CreativeWork`/`SoftwareSourceCode` para proyectos.
- `@astrojs/sitemap`, `robots.txt`, feed RSS (`@astrojs/rss`).
- Headings jerárquicos (un solo `<h1>` por página), HTML semántico, texto alternativo real.
- URLs limpias en minúsculas y estables (`/taller/mi-api`). Si cambian, añade redirecciones.
- Meta: Core Web Vitals en verde (LCP < 2.5 s, INP < 200 ms, CLS < 0.1) y Lighthouse ≥ 95 en SEO y Accesibilidad.

## 9. Seguridad y privacidad

- **Sitio estático:** no hay servidor propio ni base de datos que proteger. Mantenlo así el mayor tiempo posible.
- **Cabeceras** (`public/_headers`): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima y una CSP base (`default-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`).
- **CSP de scripts y estilos:** Astro mete scripts y estilos _inline_, que una CSP estricta bloquearía. Se activa `security.csp` de Astro, que calcula **hashes** de cada uno y los pone en una `<meta>` por página. Consecuencias: nada de `<ClientRouter />` (usar View Transitions nativas del navegador) ni Shiki (usar `<Prism />` si se resalta código); solo se prueba con `build` + `preview`, no en `dev`. Orígenes externos permitidos solo cuando se usen: `https://www.youtube-nocookie.com` (frame), `https://i.ytimg.com` (img), `https://static.cloudflareinsights.com` y `https://cloudflareinsights.com` (analítica).
- **Videos:** incrustar con `youtube-nocookie.com` y un _facade_ (miniatura que carga el reproductor al hacer clic). No cargar scripts de terceros por defecto.
- **Formulario de contacto:** en las fases 1–3 solo `mailto:` (el sitio no tiene servidor). Si en la fase 4 se quiere formulario, usar una función de Cloudflare con validación en servidor, _honeypot_ y Turnstile; nunca exponer claves en el cliente.
- **Dependencias:** lockfile versionado, `pnpm install --frozen-lockfile` en CI, Dependabot, `pnpm audit` en cada PR, versiones exactas (sin `^`). La regla de 14 días la aplica pnpm con `minimumReleaseAge: 20160` en `pnpm-workspace.yaml`; solo `sharp` y `esbuild` pueden ejecutar scripts de instalación (`allowBuilds`).
- **Repositorio:** 2FA en GitHub, protección de la rama `main`, **ningún secreto en el código** (usar variables de entorno del hosting), `.env` en `.gitignore`.
- **Privacidad:** analítica sin cookies, sin rastreadores publicitarios, página de privacidad breve y honesta. Revisar la normativa local aplicable.
- Todo contenido enviado por usuarios (si algún día hay comentarios) se sanea; no se implementa en las fases 1–3.

## 10. Accesibilidad y rendimiento

- WCAG 2.2 AA: contraste ≥ 4.5:1, foco visible, navegación por teclado, _skip link_, objetivos táctiles ≥ 44 px.
- Respetar `prefers-reduced-motion`; la taza animada debe poder quedar quieta.
- Elementos reales (`<button>`, `<a href>`, `<label>`); nada de `div` con `onClick`.
- Imágenes con ancho y alto definidos, `loading="lazy"` salvo la primera; `content-visibility` en listas largas.
- Presupuesto: JS total de la página de inicio < 50 KB comprimido; fuentes con `font-display: swap` y subconjunto latino.

## 11. Fases

Cada fase termina con: build limpio, Lighthouse sin regresión, revisión a 1440 / 768 / 390 px y despliegue.

**Fase 0 · Cimientos.** Repo, Astro + TypeScript, `AGENTS.md` + `CLAUDE.md`, tokens CSS, fuentes, logos y favicons en `/public/brand`, layouts base (`BaseLayout`, `DeskLayout`), cabeceras y CSP, CI (`astro check` + build + Prettier + `pnpm audit`), despliegue en la URL gratuita del hosting (el dominio puede llegar después). _Criterio:_ una página de prueba publicada con la paleta y la tipografía correctas.

**Fase 1 · Primer lanzamiento (MVP).** Inicio con columna fija y log, `/log`, plantilla de proyecto, `/estudio`, `/contacto`, `/privacidad`, 404, SEO base, analítica, cabeceras de seguridad, colecciones con esquemas y la lógica de "puerta de contenido". Cargar 3–5 entradas reales (por ejemplo, el primer video y el primer proyecto en curso). _Criterio:_ una persona nueva entiende de qué va en 10 segundos y agregar una entrada no requiere tocar código.

**Fase 2 · Taller y roturas.** Lista de proyectos con estados, devlog dentro de cada proyecto, colección `breaks` y `/roturas`, enlaces a GitHub/demo/video, etiquetas. _Criterio:_ cada proyecto nuevo se publica solo con un archivo MDX.

**Fase 3 · Pizarra e historia.** `/pizarra` con la sección invertida a crema, diagramas SVG que se dibujan, `/historia` con línea de tiempo animada con scroll (animaciones dirigidas por scroll con alternativa estática), transiciones suaves entre páginas con degradación elegante. _Criterio:_ funciona sin animaciones y respeta `prefers-reduced-motion`.

**Fase 4 · Descubrimiento.** Recursos descargables, búsqueda con Pagefind, RSS, boletín (servicio externo, con consentimiento explícito), imágenes OG por página. _Criterio:_ se puede encontrar cualquier entrada en dos clics o una búsqueda.

**Fase 5 · Crecimiento.** Estadísticas abiertas del canal (build in public), versión en inglés, comunidad, modo claro opcional, sección de colaboraciones. Solo cuando haya contenido y público que lo justifiquen.

## 12. Cómo trabajar (reglas para el agente)

1. **Antes de escribir interfaz** (HTML/CSS/JS del cliente), usa la skill `modern-web-guidance` (paquete del equipo de Google Chrome; instalada en `.claude/skills/`): `pnpx modern-web-guidance@latest search "<2–5 palabras>"` y luego `retrieve "<id>"`. Ejemplos de búsquedas: `scroll driven animation`, `view transition`, `dark color scheme`, `responsive layout container`, `lazy load image`. Al terminar, añade al final de la respuesta la sección `### Modern Web Guidance` que la skill exige.
2. **Diseño:** la revisión a 1440/768/390 px se hace en el navegador. **Taste Skill** (`Leonxlnx/taste-skill`, de un tercero) solo se instala después de leer su código y con el visto bueno de la persona. Criterio de diseño: decisiones propias del proyecto, no valores por defecto.
3. **El boceto manda** en estructura y concepto; la paleta y las reglas de la sección 7 son obligatorias. Si propones algo distinto, justifícalo antes de implementarlo.
4. Commits pequeños con **Conventional Commits** (`feat:`, `fix:`, `docs:`), una rama y un PR por funcionalidad. Cuando algo se rompa, anota qué pasó en el devlog (es material de contenido).
5. Explica qué hace cada pieza y por qué, como a alguien que está aprendiendo. Prefiere código simple y legible sobre soluciones ingeniosas.
6. Nunca inventes datos (estadísticas, testimonios, fechas). Usa marcadores `[POR COMPLETAR]` visibles.
7. Documenta en `/docs` cómo agregar un video, un proyecto o una pizarra, para que la persona publique sola.

## 13. Datos que debe aportar la persona

**Para la fase 0:** cuenta de Cloudflare y repositorio en GitHub · boceto · elección Outfit vs Nunito (en la página de prueba).

**Para la fase 1:** dominio elegido · handle único para las redes (`@commitandcafe`, `@commitcafe` o `@commit.cafe`) · enlaces de los canales y de GitHub · **`channel_id` de YouTube** · correo de contacto · primer proyecto que se publicará.

**Más adelante:** letra manuscrita escaneada (opcional) · texto de "Mi historia" · si quiere boletín.

## 14. Checklist de lanzamiento

- [ ] Paleta y tipografía según la sección 7.
- [ ] Sin secciones vacías visibles ni texto `lorem ipsum`.
- [ ] Cabeceras de seguridad activas (comprobar con securityheaders.com).
- [ ] Sitemap, robots, canónicas y Open Graph correctos.
- [ ] Lighthouse ≥ 95 en rendimiento, accesibilidad, SEO y buenas prácticas.
- [ ] Revisado a 1440, 768 y 390 px, con teclado y con `prefers-reduced-motion`.
- [ ] Analítica sin cookies funcionando.
- [ ] Guía de `/docs` para publicar contenido probada por la persona.

## 15. Cambios de la v1.1 (2026-11-20)

- Stack: Astro 7, TypeScript 6 (la 7 aún no la soporta `astro check`), fuentes con la API de Astro, hosting y analítica en Cloudflare, `pnpm` fijo, Prettier + `astro check` como "lint".
- Contenido: el `log` pasa a **calcularse** desde las colecciones (antes duplicaba datos); nueva colección `posts` para TikTok/Instagram/notas; nueva colección `breaks` para `/roturas`; YouTube como colección `videos` con loader propio; `story` usa `publishedAt`; el slug sale del nombre del archivo.
- Rutas: filtros del log como rutas estáticas; nueva `/privacidad`; contacto solo con `mailto:` hasta la fase 4.
- Diseño: contrastes medidos; tokens propios para Pizarra (`--tinta-apagada`, `--crema-alta`) y foco carbón sobre crema; tipografía de títulos a elegir entre Outfit y Nunito.
- Seguridad: CSP con hashes de Astro (`security.csp`) + `_headers`; regla de 14 días aplicada por pnpm.
- Proceso: `CLAUDE.md` importa `AGENTS.md`; Taste Skill solo tras revisión; datos de la persona ordenados por fase.
