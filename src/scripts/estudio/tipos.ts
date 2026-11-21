/* Datos que la página le pasa a la escena 3D (atributo data-escena). */

export type Objeto = "monitor" | "estante" | "caja" | "taza" | "general";

export interface DatosEscena {
  /** A qué objeto mira la cámara en esta página. */
  foco: Objeto;
  tazaVolcada: boolean;
  /** Un libro por proyecto en el estante (0 = no hay estante). */
  proyectos: number;
  roturas: boolean;
  /** Texto de "Construyendo" para la pantalla del monitor. */
  ahora: string;
  /** Últimas entradas del log para la pantalla del monitor. */
  entradas: { hash: string; title: string }[];
  /** Adónde lleva cada objeto al hacer clic (solo secciones que existen). */
  enlaces: Partial<Record<Objeto, string>>;
}
