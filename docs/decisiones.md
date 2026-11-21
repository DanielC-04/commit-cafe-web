# Decisiones del proyecto

Registro corto de decisiones y su porqué. La más nueva va arriba.

## 2026-11-20 · Estudio: más grande, lámpara y último video

- **Escena más grande:** secciones y canales comparten fila, la tarjeta "Ahora" es más compacta y el marco puede llegar a 30rem de alto. La columna sigue sin scroll y no cambia entre páginas. Si el marco queda más angosto que 4:3, la cámara abre el ángulo para no cortar los lados de la habitación.
- **Lámpara:** clic = apagar/encender. No es una sección; el estado se recuerda en `localStorage` (solo comodidad de quien visita).
- **Último video en el monitor:** la miniatura (`mqdefault`, 16:9) se **descarga en el build** con `getImage` y se sirve desde nuestro dominio. Así no hace falta abrir la CSP a `ytimg.com`, no hay problemas de CORS en WebGL y quien visita no se conecta a Google (la página de privacidad sigue siendo cierta). Clic en la miniatura = abre el video en otra pestaña; clic en el resto del monitor = `/log`.
- **Reproducir el video dentro del 3D no es posible:** el navegador no deja pintar un reproductor de otro sitio sobre WebGL.

## 2026-11-20 · Fase 1b: el estudio en 3D

- **Three.js 0.187 autoalojado** (pnpm, no CDN: la CSP lo bloquearía). Se importan solo las piezas usadas.
- **Dos archivos:** `montar.ts` (≈1,3 KB comprimido, en todas las páginas) decide si vale la pena el 3D; `escena.ts` (≈133 KB comprimido, con Three.js) solo se descarga en escritorio, sin "reducir movimiento" ni ahorro de datos, y cuando el navegador está libre. Presupuesto de la spec: < 50 KB inicial, ≤ 200 KB diferido.
- **La ilustración SVG sigue debajo:** el canvas aparece encima con un fundido y, si se pierde WebGL o la ventana se estrecha, vuelve la ilustración. El marco tiene tamaño fijo, así que cambiar de una a otra no mueve nada.
- **Datos reales sin script en línea:** la página pasa a la escena las últimas entradas, el estado "Ahora", los conteos y los enlaces en el atributo `data-escena` (compatible con la CSP).
- **Cámara:** cada página tiene su encuadre (`ENCUADRES` en `escena.ts`) y la cámara viaja desde el de la página anterior (`sessionStorage`). El suavizado depende del tiempo real, no de los cuadros por segundo.
- **Interacción:** clic en un objeto = su sección (solo si existe); pasar o enfocar un enlace del menú resalta su objeto. El canvas es `aria-hidden`; los enlaces HTML siguen siendo la navegación.
- **Pausa:** el bucle se detiene cuando la pestaña no se ve.

## 2026-11-20 · Fase 1a: unión de los bocetos

- **El estudio como escenario.** `boceto-web.html` da la estructura (columna fija + filas del log) y `estudio-3d.html` el mundo. La columna fija muestra la habitación en todas las páginas; el contenido siempre es HTML (spec 7.1).
- **Fase 1a con ilustración SVG** (`EstudioIlustracion.astro`), sin JavaScript: cada objeto aparece según el contenido (estante = proyectos, caja = roturas) y se resalta el de la página actual. La escena Three.js llega en la fase 1b y la sustituirá solo donde el navegador pueda.
- **Sin color madera.** El boceto 3D usaba un marrón para el escritorio; se cambió por los tonos de la paleta (spec 7: no agregar colores).
- **Puerta de contenido real:** `/log`, `/taller` y `/roturas` son rutas `[...page]` que devuelven `[]` cuando no hay entradas, así que ni se generan ni se enlazan.
- **Ejemplos en borrador:** `src/content/**/ejemplo-*` tienen `draft: true` y `[EJEMPLO]` en el título. Solo se ven en `pnpm dev`; se borran o reemplazan con el primer contenido real.
- **`TazaViva.astro` eliminada:** su papel lo cumple la taza de la ilustración.

## 2026-11-20 · Rama develop y despliegues por lotes

- **Solo producción gasta créditos** en Netlify (15 por despliegue; 300 al mes en el plan gratuito). Vistas previas y despliegues de rama son gratis.
- **`develop` es la rama por defecto** y de integración; `main` es producción y solo recibe PRs `develop → main` con varias mejoras. Detalle en `docs/flujo-de-trabajo.md`.
- **Repositorio público.** Con repo privado, el plan gratuito de Netlify bloqueaba las vistas previas ("Unrecognized Git contributor") aunque la cuenta de GitHub estuviera vinculada. Hacerlo público lo resolvió y encaja con el "build in public" del canal.
- **Merge commit habilitado** solo para los PRs `develop → main`, para que ambas ramas compartan historial.

## 2026-11-20 · Hosting en Netlify

- **Netlify en vez de Cloudflare.** Decisión de la persona. Netlify lee el mismo `public/_headers`, crea un _Deploy Preview_ por cada PR (con `noindex` automático) y ofrece Netlify Forms para un futuro formulario sin servidor propio.
- **`netlify.toml`** fija el comando (`pnpm build`), la carpeta (`dist`) y Node 24. No hace falta adaptador: el sitio es 100 % estático.
- **URL del sitio.** Netlify da la variable `URL` en cada build (la del dominio principal). `astro.config.mjs` la usa si no hay `SITE_URL`, así que no hay que configurar nada a mano.
- **Analítica: por decidir** en la fase 1 (Umami Cloud gratis o Netlify Analytics de pago).

## 2026-11-20 · Fase 0

- **Astro 7.4.7 y TypeScript 6.** `@astrojs/check` todavía no admite TypeScript 7. Cuando lo admita, se actualiza.
- **pnpm con `minimumReleaseAge: 20160`.** Aplica sola la regla de no instalar versiones de menos de 14 días. Por eso no tenemos el último parche de cada paquete, y está bien así.
- **Fuentes con la API de Astro (proveedor Fontsource).** En vez de instalar paquetes `@fontsource-variable/*`, Astro descarga las fuentes en el build, las sirve desde nuestro dominio, precarga solo Outfit y Figtree y genera fuentes de respaldo con métricas parecidas para evitar saltos de texto.
- **Títulos: Outfit** (elegida por la persona tras compararla con Nunito en la página de prueba). Nunito se quitó de `astro.config.mjs`.
- **CSP en dos partes.** Astro pone una `<meta>` con hashes de scripts y estilos; `public/_headers` añade lo que una `<meta>` no puede (`frame-ancestors`, etc.). Consecuencia: no se pueden usar `style="..."` ni `onclick`.
- **Solo tema oscuro.** `color-scheme: dark` en `:root`. La Pizarra cambia a `color-scheme: light` con la clase `.pizarra`.
- **`SITE_URL`.** La URL pública se define como variable de entorno en el hosting. Sin ella, el build usa `http://localhost:4321` (solo sirve en local).
- **Taza viva.** `TazaViva.astro` lee `icono.svg` en el build y separa las 3 volutas de vapor para animarlas. No hay JavaScript en el navegador.
- **`compressHTML: true`.** Astro 7 usa por defecto reglas de espacios tipo JSX que se comían el espacio antes de `<code>` o `<a>` cuando Prettier partía la línea. Con `true` comprime sin perder espacios.
- **Override de `@emnapi/runtime` a 1.11.3** (`pnpm-workspace.yaml`). pnpm elegía una beta 2.0 incompatible y `astro check` fallaba. Revisar al actualizar `@astrojs/check`.
