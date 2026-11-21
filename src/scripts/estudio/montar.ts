/*
  Cargador de la escena 3D (spec 7.1, capa 2). Es lo único que se descarga
  siempre y pesa muy poco. Decide si vale la pena el 3D y, solo entonces,
  pide la escena (con Three.js) cuando el navegador está libre.

  Sin 3D (pantalla estrecha, "reducir movimiento", ahorro de datos o sin
  WebGL) se queda la ilustración SVG, que ya está en la página.
*/
import type { DatosEscena } from "./tipos";

const ESCRITORIO = "(min-width: 64rem)";

function puedeUsar3D(): boolean {
  if (!matchMedia(ESCRITORIO).matches) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conexion = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (conexion?.saveData) return false;
  return true;
}

function cuandoEsteLibre(tarea: () => void) {
  if ("requestIdleCallback" in window)
    requestIdleCallback(tarea, { timeout: 2500 });
  else setTimeout(tarea, 300);
}

function iniciar() {
  const enlace = document.querySelector<HTMLAnchorElement>("[data-escena]");
  const marco = enlace?.querySelector<HTMLElement>(".estudio-marco");
  if (!enlace || !marco || !puedeUsar3D()) return;

  let datos: DatosEscena;
  try {
    datos = JSON.parse(enlace.dataset.escena ?? "");
  } catch {
    return;
  }

  cuandoEsteLibre(async () => {
    try {
      const { montarEscena } = await import("./escena");
      montarEscena({ enlace, marco, datos });
    } catch (error) {
      // Si algo falla, la ilustración sigue ahí: el sitio no se rompe.
      console.warn("Estudio 3D no disponible:", error);
    }
  });
}

iniciar();
