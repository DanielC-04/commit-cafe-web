# Commit&Cafe web — reglas del proyecto

La especificación completa está en [`docs/spec.md`](docs/spec.md) (v1.1). Léela antes de cambiar algo. Este archivo resume lo que hay que tener presente siempre.

## Con quién trabajas

Una persona estudiante de último año de desarrollo de software. Explica cada decisión en lenguaje simple, haz cambios pequeños, prefiere código legible a soluciones ingeniosas. Responde en español.

## Comandos

```sh
pnpm install          # instala exactamente lo del lockfile
pnpm dev              # servidor local en http://localhost:4321
pnpm build            # astro check + build (lo mismo que la CI)
pnpm preview          # sirve el build; aquí se prueba la CSP
pnpm format           # Prettier
pnpm brand            # regenera favicon, apple-touch-icon y og-default
```

## Reglas que no se negocian

- **Color:** solo los tokens de `src/styles/tokens.css`. Los componentes usan los roles (`--fondo`, `--texto`, `--vivo`…), no los hex.
- **Sin estilos ni scripts en línea** (`style="..."`, `onclick`): la CSP los bloquea. Usa clases y `<script>` de Astro.
- **Sin `<ClientRouter />` ni Shiki** (incompatibles con la CSP). Transiciones con la View Transitions API nativa; código resaltado con `<Prism />`.
- **Movimiento:** estático por defecto; las animaciones van dentro de `@media (prefers-reduced-motion: no-preference)`.
- **Contenido:** nunca inventes datos. Usa `[POR COMPLETAR]` visible.
- **Dependencias:** no añadas paquetes sin justificarlo a la persona. pnpm rechaza versiones de menos de 14 días (`pnpm-workspace.yaml`); no lo desactives. Versiones exactas, sin `^`.
- **Interfaz:** antes de escribir HTML/CSS/JS de cliente, consulta la skill `modern-web-guidance` (`.claude/skills/`).
- **Git:** ramas `feature/…` desde `develop` y PR hacia `develop` (squash). A `main` (producción, gasta créditos de Netlify) solo llega un PR `develop → main` con varias mejoras, fusionado con merge commit. Nunca push directo a `main` ni `develop`. Detalle en [`docs/flujo-de-trabajo.md`](docs/flujo-de-trabajo.md). Conventional Commits (`feat:`, `fix:`, `docs:`). Si algo se rompe, anótalo: es material para el devlog.

## Navegadores

Baseline "Widely available" sin fallbacks. Funciones "Newly available" solo como mejora progresiva (si el navegador no las tiene, la página sigue funcionando).
