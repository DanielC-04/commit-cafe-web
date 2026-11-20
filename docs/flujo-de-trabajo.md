# Flujo de trabajo con Git y Netlify

## Por qué así

En Netlify, cada despliegue a **producción** gasta 15 créditos; el plan gratuito trae 300 al mes (unos 20 despliegues). Las **vistas previas** de PR y los despliegues de rama son **gratis**. Por eso:

- Se trabaja y se prueba en ramas que **no** son producción (gratis).
- A producción (`main`) solo se sube un **lote de mejoras** de vez en cuando.

## Las ramas

| Rama                            | Para qué                                                                               | ¿Gasta créditos?          |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------- |
| `feature/…`, `fix/…`, `chore/…` | Una funcionalidad o arreglo. Sale de `develop`                                         | No (vista previa del PR)  |
| `develop`                       | Integración: aquí se juntan las mejoras ya revisadas. Es la rama por defecto en GitHub | No (despliegue de rama)   |
| `main`                          | Producción: lo que ve el público en commit-cafe.netlify.app                            | **Sí, 15 por despliegue** |

## El día a día

1. Crea la rama desde `develop`:
   ```sh
   git switch develop && git pull
   git switch -c feature/mi-mejora
   ```
2. Trabaja y prueba en local (`pnpm dev`; para probar la CSP, `pnpm build && pnpm preview`).
3. Sube la rama y abre un PR **hacia `develop`** (es el destino por defecto).
4. La CI tiene que pasar. Netlify crea una vista previa del PR (gratis, solo la ve tu equipo).
5. Fusiona el PR con **Squash and merge**: cada funcionalidad queda como un solo commit en `develop`.

## Publicar en producción (de vez en cuando)

1. Cuando `develop` tenga varias mejoras probadas, abre un PR de **`develop` → `main`** titulado `release: …` con la lista de cambios.
2. Fusiónalo con **Create a merge commit** (no squash): así `main` y `develop` comparten historial y no se separan.
3. Netlify despliega `main` a producción (15 créditos). Comprueba el sitio publicado.

## Reglas

- Nunca se hace push directo a `main` ni a `develop`: ambas están protegidas y exigen que la CI pase.
- Un arreglo urgente en producción sigue el mismo camino (rama → `develop` → `main`), solo que el lote es de un cambio.
- Si un despliegue de producción falla, no gasta créditos y el sitio anterior sigue publicado: se arregla en una rama nueva.
