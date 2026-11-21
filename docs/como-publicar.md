# Cómo publicar contenido

Publicar = **agregar un archivo**. No se toca código. Al hacer el build, Astro revisa cada archivo: si falta un dato o tiene un formato raro, el build falla y te dice en qué archivo y qué campo.

El **nombre del archivo** es su dirección: `src/content/projects/mi-api.mdx` → `/taller/mi-api`. Usa minúsculas y guiones, sin tildes ni espacios.

Todo lo que publiques aparece solo en el **log** (el inicio y `/log`), ordenado por `publishedAt`.

## Con el panel (lo más fácil)

1. Abre [app.pagescms.org](https://app.pagescms.org) e inicia sesión con GitHub.
2. Instala la app de Pages CMS solo en el repositorio `DanielC-04/commit-cafe-web`.
3. Elige la rama `contenido`. La primera vez, créala desde `develop`.
4. Completa los formularios y guarda. Cada guardado crea un commit en `contenido`.
5. Abre un PR de `contenido` hacia `develop` con squash. Revisa la vista previa de Netlify y, cuando corresponda, sigue el flujo habitual de publicación de `develop` hacia `main`.

6. Cuando el PR se fusione, borra la rama `contenido` (botón "Delete branch" en GitHub) y vuelve a crearla desde `develop` la próxima vez. Con squash, la rama vieja queda desfasada y el siguiente PR arrastraría cambios ya fusionados.

Los videos de YouTube no necesitan que hagas nada: se cargan solos. Si un guardado rompe el build, la comprobación `build` del PR indica el archivo y el campo que hay que corregir.

Hay campos que el panel no puede vigilar: en "Shorts y notas", la URL es obligatoria salvo en las notas propias (plataforma Web). Si falta, el build lo avisa.

La página Estudio (nombre, presentación, setup, herramientas y pasos) se edita en **"Estudio (quién soy)"**.

## A mano (sin panel)

Si prefieres crear los archivos tú mismo, estas son las plantillas de cada tipo de contenido.

## Borradores

Pon `draft: true` y el contenido solo se verá en `pnpm dev`, nunca en el sitio publicado.

## Un video de YouTube

Nada: se cargan solos desde el feed del canal en cada build. El más reciente aparece además en el monitor del estudio 3D, con su miniatura. Requisito (una sola vez): poner el `youtubeChannelId` en `src/site.ts`. Netlify reconstruye el sitio cuando subes a `main`, así que los videos nuevos aparecen en el siguiente despliegue.

## Un TikTok, un Reel de Instagram o una nota

Archivo en `src/content/posts/`, por ejemplo `src/content/posts/mi-primer-tiktok.md`:

```md
---
title: "Por qué git rebase me asustaba"
summary: "Un minuto explicando rebase con café."
kind: short # short (video corto) o note (nota escrita)
platform: tiktok # youtube, tiktok, instagram o web
url: https://www.tiktok.com/@[POR COMPLETAR]/video/123
publishedAt: 2026-11-21
tags: [git]
---
```

Si es una **nota** propia (`platform: web`), no lleva `url`: escribe el texto debajo de los `---` y tendrá su página en `/notas/<nombre-del-archivo>`.

## Un proyecto del Taller

Archivo `.mdx` en `src/content/projects/`:

```mdx
---
title: "Mi API de café"
tagline: "Una API que te dice cuánto café tomaste esta semana."
status: building # idea, building, shipped, paused o broken
startedAt: 2026-11-01
publishedAt: 2026-11-21
stack: [Node, Express]
links:
  repo: https://github.com/DanielC-04/mi-api
  # demo: https://…
  # video: https://youtube.com/…
tags: [api]
---

## Por qué lo hice

## Qué se rompió

## Qué aprendí
```

## Una entrada de devlog

Archivo en `src/content/devlog/`. Aparece dentro de la página de su proyecto:

```md
---
project: mi-api # el nombre del archivo del proyecto, sin .mdx
title: "Primer endpoint funcionando"
publishedAt: 2026-11-22
---

Hoy conseguí que /cafes devuelva datos reales…
```

## El estado "Ahora"

Edita `src/content/now.json`:

```json
{
  "estudio": {
    "building": "Mi API de café",
    "lastCommit": "Primer endpoint funcionando",
    "updatedAt": "2026-11-22"
  }
}
```

## La página Estudio

Edita `src/content/estudio.json`:

```json
{
  "estudio": {
    "nombre": null,
    "presentacion": null,
    "setup": [],
    "herramientas": [],
    "proceso": []
  }
}
```

## Tus datos (correo, redes, canal)

Todo está en `src/site.ts`. Lo que esté en `null` no se muestra o aparece como `[POR COMPLETAR]`.

## Después de agregar el archivo

1. `pnpm dev` y revisa que se vea bien.
2. Commit en tu rama `feature/…` y PR hacia `develop` (ver `docs/flujo-de-trabajo.md`).
