/* Utilidades de formato compartidas por las páginas. */

const fecha = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "20 nov 2026". Las fechas del contenido son días, así que se leen en UTC. */
export function formatDate(date: Date): string {
  return fecha.format(date);
}

/** "2026-11-20", para el atributo datetime de <time>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const STATUS_LABELS = {
  idea: "Idea",
  building: "En construcción",
  shipped: "Publicado",
  paused: "En pausa",
  broken: "Roto",
} as const;
