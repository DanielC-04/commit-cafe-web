/*
  "Puerta de contenido" (spec 2.2): una sección aparece en la navegación
  y en el inicio SOLO si tiene al menos una entrada publicada. Sin
  entradas, ni se enlaza ni se genera su página (ver las rutas
  [...page].astro, que devuelven [] cuando no hay nada).
*/
import { getCollection } from "astro:content";
import { isPublished, getLog } from "./log";

/** Objeto del estudio que representa cada sección (spec 7.1). */
export type Objeto = "monitor" | "estante" | "caja" | "taza" | "general";

export interface Section {
  href: string;
  label: string;
  objeto: Objeto;
}

/** Secciones visibles en la navegación, en orden. */
export async function getSections(): Promise<Section[]> {
  const [log, projects, breaks] = await Promise.all([
    getLog(),
    getCollection("projects", isPublished),
    getCollection("breaks", isPublished),
  ]);

  const sections: Section[] = [];
  if (log.length > 0)
    sections.push({ href: "/log", label: "Log", objeto: "monitor" });
  if (projects.length > 0)
    sections.push({ href: "/taller", label: "Taller", objeto: "estante" });
  if (breaks.length > 0)
    sections.push({ href: "/roturas", label: "Roturas", objeto: "caja" });
  // Estas dos siempre existen: no dependen de contenido.
  sections.push({ href: "/estudio", label: "Estudio", objeto: "general" });
  sections.push({ href: "/contacto", label: "Contacto", objeto: "taza" });
  return sections;
}
