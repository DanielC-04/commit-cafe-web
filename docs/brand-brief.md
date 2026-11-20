# Commit&Cafe — Brief de identidad de marca para IA

> **Cómo usar este documento:** pégalo completo en la IA que vaya a continuar el trabajo y **adjunta la imagen del logo ganador** (`Commit_Cafe_Ampersand_Logo.png`). Este brief contiene todo el contexto, las correcciones que hay que hacer y los prompts de cada pieza. La IA no necesita conocer la conversación anterior.

---

## 1. Contexto del proyecto

- **Nombre de la marca:** Commit&Cafe (escrito siempre así: sin tilde en "Cafe", con `&` en medio, sin espacios).
- **Qué es:** canal de YouTube / TikTok sobre **desarrollo de software**, en español, de tono cercano, con humor dev y consejos de carrera ("dev en el mundo real").
- **Idea del nombre:** _commit_ (el comando de Git) + _café_ (el ritual del programador). El símbolo `&` une ambos mundos.
- **Público:** personas que empiezan en programación o quieren avanzar en su carrera dev, hispanohablantes.
- **Personalidad visual:** moderna, cálida, minimalista, amigable, con guiño a la estética de editor de código.

## 2. El logo ganador (imagen adjunta)

Descripción de lo que muestra la imagen de referencia:

- Círculo grande de fondo **carbón oscuro**.
- Un **`&` gigante en crema**, estilizado: su parte superior tiene forma de **taza de café** (con borde elíptico y hueco oscuro arriba).
- Sobre la taza, **3 volutas de vapor en naranja**.
- Debajo, el texto **"Commit&Cafe"** en una tipografía **sans-serif redondeada, geométrica y en negrita** (estilo similar a Nunito / Quicksand / Poppins Bold). El `&` del texto va en **naranja**, el resto en crema.
- Estilo: **vector plano**, sin degradados, sin sombras, sin texturas.

### Paleta oficial (valores aproximados extraídos de la imagen)

| Rol                            | Color             | HEX       |
| ------------------------------ | ----------------- | --------- |
| Fondo                          | Carbón casi negro | `#1B1D1C` |
| Principal (símbolo y texto)    | Crema             | `#F5E8D5` |
| Acento (vapor y `&` del texto) | Naranja cálido    | `#E8913F` |

> Si la IA puede muestrear los colores directamente de la imagen, que lo haga y los use como referencia exacta.

---

## 3. Problemas del logo actual que hay que corregir

1. **El fondo exterior es blanco, no transparente.** Debe eliminarse para poder usarlo sobre el banner, videos y miniaturas.
2. **El texto "Commit&Cafe" se vuelve ilegible en tamaños pequeños** y queda demasiado pegado al borde inferior del círculo. Para la foto de perfil debe usarse **solo el ícono** (el `&` con vapor, sin texto).
3. **La composición no está centrada si se aísla el ícono.** El `&` y el vapor deben quedar centrados óptica y geométricamente dentro del círculo, con margen respirable (mínimo 15 % del diámetro hasta el borde).
4. **Calidad vectorial:** el resultado ideal es SVG; si solo se puede en PNG, exportar en alta resolución (mínimo 2048 x 2048 px).

---

## 4. Entregables que hay que producir

Producir estas **4 versiones** a partir del logo ganador, **manteniendo exactamente el mismo diseño del `&`, el vapor y la paleta**:

| #   | Versión                       | Descripción                                                                                         | Uso                                        | Tamaño sugerido                         |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| 1   | **Ícono (avatar)**            | `&` con vapor, sin texto, centrado en el círculo oscuro                                             | Foto de perfil YouTube/TikTok, favicon     | 800 x 800 px (y 2048 x 2048 px maestro) |
| 2   | **Completo (actual, limpio)** | El logo tal cual, con texto, pero con fondo exterior transparente y texto mejor espaciado           | Intro/cierre de videos, miniaturas, web    | 2048 x 2048 px, PNG transparente        |
| 3   | **Horizontal**                | Ícono a la izquierda + "Commit&Cafe" a la derecha, **sin círculo de fondo** o con fondo carbón liso | Banner de YouTube, firmas, presentaciones  | 2400 x 800 px aprox.                    |
| 4   | **Monocromo**                 | Todo en una sola tinta (crema `#F5E8D5` sobre transparente; opcional versión negra)                 | Marca de agua sobre video, stickers, merch | 1024 x 1024 px, PNG transparente        |

Entregar cada versión en **PNG con fondo transparente** y, si es posible, en **SVG**.

---

## 5. Prompts por pieza (en inglés, para IA generativa de imágenes)

> **Nota importante:** las IA de imagen suelen escribir mal los textos. Si "Commit&Cafe" sale con errores, generar **solo el ícono** y añadir el texto después en Canva/Figma con una fuente parecida (ver sección 7). Si la IA acepta una imagen de referencia, **adjuntar el logo ganador** y usar los prompts como instrucciones de edición.

### 5.1 Ícono (avatar) — sin texto

```
Using the attached logo as exact reference, create a minimalist vector avatar icon for a developer channel. Keep only the large cream ampersand "&" whose top part forms a coffee cup, with three flame-like steam wisps in warm orange rising from it. Remove all text. Center the symbol perfectly inside a dark charcoal circle (#1B1D1C) with generous margin around it. Flat design, clean bold shapes, no gradients, no shadows, no textures. Colors only: cream #F5E8D5, orange #E8913F, charcoal #1B1D1C. High contrast, readable at 100x100 px. Transparent background outside the circle. Square 1:1 format.
```

### 5.2 Completo — mismo logo con fondo limpio

```
Recreate the attached logo exactly: a dark charcoal circle (#1B1D1C) containing a large cream (#F5E8D5) ampersand "&" shaped like a coffee cup with three orange (#E8913F) steam wisps, and below it the text "Commit&Cafe" in a bold rounded geometric sans-serif font, with the ampersand in the text colored orange and the rest cream. Fix these issues: make the area outside the circle fully transparent, add more space between the text and the circle's bottom edge, keep the symbol and text centered. Flat vector style, no gradients, no shadows. Square 1:1, high resolution.
```

### 5.3 Horizontal — ícono + nombre

```
Horizontal logo lockup for a software developer channel. On the left, a circular icon: dark charcoal circle (#1B1D1C) with a large cream (#F5E8D5) ampersand "&" shaped like a coffee cup with three orange (#E8913F) steam wisps. On the right, the text "Commit&Cafe" in a bold rounded geometric sans-serif font (similar to Nunito Bold or Poppins Bold), cream colored, with the ampersand in orange. Icon and text vertically centered, text height about 40% of icon height, comfortable spacing between them. Flat vector design, no gradients, no shadows. Transparent background. Wide aspect ratio about 3:1.
```

### 5.4 Monocromo (una tinta)

```
Single-color version of the attached logo: only the ampersand-shaped coffee cup with three steam wisps, all in solid cream (#F5E8D5), no circle, no text, no orange, no background. Flat minimal vector silhouette with clean edges. Fully transparent background. Suitable as a watermark over video. Square 1:1.
```

### 5.5 Variante: monocromo oscuro (opcional)

```
Same as the single-color version but all in solid dark charcoal (#1B1D1C) on a transparent background, for use over light backgrounds.
```

---

## 6. Banner de YouTube (instrucciones)

- **Tamaño:** 2560 x 1440 px.
- **Zona segura (donde debe estar TODO lo importante):** rectángulo central de **1546 x 423 px**. Lo que quede fuera se recorta en celular, tablet o TV.
- **Fondo:** carbón `#1B1D1C`, liso o con un patrón muy sutil de líneas de código en un gris apenas más claro (casi invisible).
- **Contenido dentro de la zona segura:**
  - Logo horizontal o ícono a un lado.
  - **Eslogan** en una línea (elegir uno): _"Código, café y lo que no te cuentan los cursos"_ · _"Un commit a la vez, una taza a la vez"_ · _"Dev en el mundo real, con café"_.
  - **Horario:** "Videos nuevos martes y viernes" (ajustar al real).
- **Tipografía:** la misma sans-serif redondeada del logo para el eslogan; opcional una fuente monoespaciada para el horario.
- **TikTok no tiene banner:** usa la foto de perfil (ícono) y la bio.

### Prompt para el fondo del banner (si se genera con IA)

```
Wide abstract background for a YouTube channel banner, 16:9, dark charcoal (#1B1D1C) with extremely subtle faint lines of code and curly braces in a slightly lighter gray, barely visible, minimalist, lots of empty space in the center, no text, no logo, flat design, no gradients, warm and clean. A few tiny orange (#E8913F) accents at the far edges only.
```

_(Después, componer el logo y los textos encima con Canva o Figma, respetando la zona segura.)_

---

## 7. Tipografías recomendadas (gratis)

- **Texto de marca (similar al del logo):** Nunito Bold, Quicksand Bold o Poppins Bold (Google Fonts).
- **Detalles "dev" / horario:** JetBrains Mono, Space Mono o Fira Code.

---

## 8. Reglas de uso de la marca

- Usar siempre el nombre **Commit&Cafe** (sin espacios, sin tilde).
- Mínimo **3 colores**: carbón, crema y naranja. No añadir otros.
- **No** deformar, rotar ni cambiar los colores del `&`.
- Dejar un margen libre alrededor del logo igual a la altura de la taza del `&`.
- En tamaños muy pequeños (< 150 px) usar siempre la **versión ícono sin texto**.
- Sobre fondos claros usar la versión monocromo oscura; sobre oscuros, la crema.

### Usuarios de redes (el `&` no se permite en los handles)

Opciones, elegir **una** y repetirla en todas las redes: `@commitandcafe` · `@commitcafe` · `@commit.cafe`

---

## 9. Checklist final antes de dar por terminado

- [ ] Ícono centrado, sin texto, legible a 100 x 100 px.
- [ ] Versión completa con fondo exterior **transparente**.
- [ ] Versión horizontal con texto escrito correctamente: **Commit&Cafe**.
- [ ] Versión monocromo crema (y opcionalmente oscura) con fondo transparente.
- [ ] Todos los archivos en PNG transparente (y SVG si es posible).
- [ ] Colores consistentes con la paleta de la sección 2.
- [ ] Banner con todo lo importante dentro de la zona segura de 1546 x 423 px.
- [ ] Archivos nombrados: `icono.png`, `completo.png`, `horizontal.png`, `monocromo.png`, `banner.png`.

---

## 10. Instrucción final para la IA

Actúa como diseñador de identidad de marca. Con la imagen adjunta como referencia visual exacta y este documento como brief, genera o ayuda a generar las 4 versiones del logo y el banner descritos arriba, **sin alterar el diseño base** (el `&` con forma de taza, el vapor naranja, la paleta y la tipografía). Si algo no es posible con tus herramientas (por ejemplo, SVG o fondo transparente), dime qué alternativa gratuita usar (Canva, Figma, Photopea) y dame los pasos exactos.
