/*
  El estudio en 3D (spec 7.1, capa 2). Versión de estudio-3d.html adaptada:
  - Solo la paleta de marca, low-poly y sombreado plano (como el logo).
  - Los objetos salen de los datos reales: el monitor muestra las últimas
    entradas del log, el estante tiene un libro por proyecto y la caja solo
    aparece si hay roturas (puerta de contenido).
  - La cámara encuadra el objeto de cada página y viaja desde donde estaba
    en la página anterior.
  - Clic en un objeto = ir a su sección. Pasar sobre un enlace del menú =
    resaltar su objeto. La navegación real sigue siendo el HTML.
  - Se pausa cuando la pestaña no se ve y vuelve a la ilustración si se
    pierde el contexto WebGL.
*/
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type { DatosEscena, Objeto } from "./tipos";

/* Paleta de marca (spec 7). Nada fuera de aquí. */
const C = {
  carbon: 0x1b1d1c,
  alto: 0x262928,
  crema: 0xf5e8d5,
  apagada: 0xb8ae9e,
  naranja: 0xe8913f,
};

/* Encuadres de cámara por objeto: [posición, punto al que mira]. */
const ENCUADRES: Record<Objeto, [Vector3, Vector3]> = {
  general: [new Vector3(0.15, 1.9, 4.5), new Vector3(0, 1.35, -0.5)],
  monitor: [new Vector3(0, 1.75, 2.0), new Vector3(0, 1.68, -0.7)],
  estante: [new Vector3(2.15, 2.4, 0.75), new Vector3(1.8, 2.35, -1.4)],
  caja: [new Vector3(1.2, 1.05, 2.1), new Vector3(1.9, 0.3, 0.1)],
  taza: [new Vector3(0.7, 1.45, 1.5), new Vector3(1.0, 1.15, 0.15)],
};

const CLAVE_CAMARA = "estudio:camara";

interface Montaje {
  enlace: HTMLAnchorElement;
  marco: HTMLElement;
  datos: DatosEscena;
}

const mat = (color: number, extra: Partial<MeshStandardMaterial> = {}) =>
  new MeshStandardMaterial({
    color,
    roughness: 0.85,
    flatShading: true,
    ...extra,
  });

export function montarEscena({ enlace, marco, datos }: Montaje) {
  /* ---------- Renderizador (si falla, se queda la ilustración) ---------- */
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  marco.append(canvas);

  const scene = new Scene();
  scene.background = new Color(C.carbon);
  scene.fog = new Fog(C.carbon, 7, 16);
  const camera = new PerspectiveCamera(42, 4 / 3, 0.1, 50);

  const add = (
    geo: ConstructorParameters<typeof Mesh>[0],
    m: MeshStandardMaterial | MeshBasicMaterial,
    x: number,
    y: number,
    z: number,
    parent: Object3D = scene,
  ) => {
    const mesh = new Mesh(geo, m);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  /* ---------- Habitación ---------- */
  add(new PlaneGeometry(16, 10), mat(C.carbon), 0, 0, 0).rotation.x =
    -Math.PI / 2;
  add(new PlaneGeometry(16, 6), mat(C.alto), 0, 3, -1.6);

  // Escritorio (crema apagada: el boceto usaba madera, fuera de la paleta).
  add(new BoxGeometry(3.6, 0.1, 1.4), mat(C.apagada), 0, 0.9, -0.4);
  for (const [x, z] of [
    [-1.7, -0.95],
    [1.7, -0.95],
    [-1.7, 0.15],
    [1.7, 0.15],
  ] as const) {
    add(new BoxGeometry(0.08, 0.85, 0.08), mat(C.alto), x, 0.45, z);
  }

  // Ventana con luna (fase 3: "Mi historia").
  add(new BoxGeometry(1.7, 1.2, 0.04), mat(C.carbon), -2.7, 2.5, -1.58);
  add(
    new PlaneGeometry(1.5, 1),
    new MeshBasicMaterial({ color: 0x141615 }),
    -2.7,
    2.5,
    -1.55,
  );
  add(
    new CircleGeometry(0.12, 20),
    new MeshBasicMaterial({ color: C.crema }),
    -2.4,
    2.75,
    -1.54,
  );

  // Lámpara.
  add(
    new CylinderGeometry(0.08, 0.1, 0.03, 12),
    mat(C.carbon),
    -1.3,
    0.97,
    -0.5,
  );
  add(
    new CylinderGeometry(0.015, 0.015, 0.7, 6),
    mat(C.carbon),
    -1.3,
    1.3,
    -0.5,
  );
  add(
    new ConeGeometry(0.2, 0.22, 14, 1, true),
    mat(C.naranja, {
      side: DoubleSide,
      emissive: new Color(C.naranja),
      emissiveIntensity: 0.35,
    }),
    -1.3,
    1.72,
    -0.5,
  );

  /* ---------- Objetos-sección (se pueden resaltar y clicar) ---------- */
  const objetos = new Map<Objeto, Group>();
  const grupo = (nombre: Objeto) => {
    const g = new Group();
    g.userData.objeto = nombre;
    scene.add(g);
    objetos.set(nombre, g);
    return g;
  };

  // Monitor: la pantalla dibuja el log real.
  const monitor = grupo("monitor");
  add(new BoxGeometry(1.6, 0.95, 0.06), mat(C.carbon), 0, 1.7, -0.72, monitor);
  add(new BoxGeometry(0.12, 0.35, 0.1), mat(C.carbon), 0, 1.15, -0.72, monitor);
  add(new BoxGeometry(0.5, 0.03, 0.3), mat(C.carbon), 0, 0.97, -0.7, monitor);
  const lienzo = document.createElement("canvas");
  lienzo.width = 1024;
  lienzo.height = 600;
  const textura = new CanvasTexture(lienzo);
  textura.colorSpace = SRGBColorSpace;
  add(
    new PlaneGeometry(1.5, 0.88),
    new MeshBasicMaterial({ map: textura }),
    0,
    1.7,
    -0.685,
    monitor,
  );
  dibujarPantalla(lienzo, textura, datos);
  document.fonts?.ready.then(() => dibujarPantalla(lienzo, textura, datos));

  // Taza y vapor.
  const taza = grupo("taza");
  const tazaCuerpo = new Group();
  taza.add(tazaCuerpo);
  add(
    new CylinderGeometry(0.14, 0.11, 0.22, 16),
    mat(C.crema),
    0,
    0,
    0,
    tazaCuerpo,
  );
  add(
    new CylinderGeometry(0.125, 0.125, 0.01, 16),
    mat(C.carbon),
    0,
    0.105,
    0,
    tazaCuerpo,
  );
  add(
    new TorusGeometry(0.07, 0.02, 8, 16),
    mat(C.crema),
    0.16,
    0,
    0,
    tazaCuerpo,
  );
  tazaCuerpo.position.set(1, 1.07, 0.15);
  const vapor: { m: Mesh<SphereGeometry, MeshBasicMaterial>; f: number }[] = [];
  if (datos.tazaVolcada) {
    // 404: la taza volcada y el café derramado.
    tazaCuerpo.rotation.z = -Math.PI / 2.2;
    tazaCuerpo.position.set(1.05, 1.06, 0.15);
    const charco = add(
      new CircleGeometry(0.17, 16),
      mat(C.carbon),
      1.3,
      0.952,
      0.02,
      taza,
    );
    charco.rotation.x = -Math.PI / 2;
  } else {
    for (let i = 0; i < 16; i++) {
      const m = new Mesh(
        new SphereGeometry(0.022, 6, 6),
        new MeshBasicMaterial({ color: C.naranja, transparent: true }),
      );
      taza.add(m);
      vapor.push({ m, f: i / 16 });
    }
  }

  // Estante (Taller): un libro por proyecto.
  if (datos.proyectos > 0) {
    const estante = grupo("estante");
    add(
      new BoxGeometry(1.4, 0.05, 0.3),
      mat(C.apagada),
      1.85,
      2.3,
      -1.42,
      estante,
    );
    const colores = [C.crema, C.apagada, C.naranja];
    const libros = Math.min(datos.proyectos, 12);
    for (let i = 0; i < libros; i++) {
      const alto = i % 3 === 1 ? 0.3 : 0.38;
      add(
        new BoxGeometry(0.09, alto, 0.22),
        mat(colores[i % 3]),
        1.3 + i * 0.105,
        2.325 + alto / 2,
        -1.42,
        estante,
      );
    }
  }

  // Caja de roturas.
  if (datos.roturas) {
    const caja = grupo("caja");
    add(
      new BoxGeometry(0.55, 0.36, 0.42),
      mat(C.apagada),
      1.9,
      0.18,
      0.1,
      caja,
    );
    const tapa = add(
      new BoxGeometry(0.57, 0.03, 0.22),
      mat(C.crema),
      1.9,
      0.4,
      -0.02,
      caja,
    );
    tapa.rotation.x = -0.5;
  }

  /* ---------- Luces ---------- */
  const luzLampara = new PointLight(0xffc98a, 14, 7, 1.6);
  luzLampara.position.set(-1.3, 1.6, -0.35);
  scene.add(luzLampara);
  const luzFrontal = new PointLight(C.crema, 6, 6, 1.6);
  luzFrontal.position.set(0.3, 1.9, 0.6);
  scene.add(luzFrontal);
  scene.add(new AmbientLight(0x4a443e, 2));

  /* ---------- Resaltado (hover en la escena o en el menú) ---------- */
  let resaltado: Objeto | null = null;
  function resaltar(nombre: Objeto | null) {
    if (nombre === resaltado) return;
    for (const [n, g] of objetos) {
      const activo = n === nombre;
      g.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (m && "emissive" in m && m !== undefined && !m.userData.fijo) {
          m.emissive.setHex(activo ? C.naranja : 0x000000);
          m.emissiveIntensity = activo ? 0.5 : 0;
        }
      });
    }
    resaltado = nombre;
  }

  /* ---------- Clic y hover sobre objetos ---------- */
  const raycaster = new Raycaster();
  const puntero = new Vector2();
  function objetoBajo(evento: PointerEvent): Objeto | null {
    const r = canvas.getBoundingClientRect();
    puntero.set(
      ((evento.clientX - r.left) / r.width) * 2 - 1,
      -((evento.clientY - r.top) / r.height) * 2 + 1,
    );
    raycaster.setFromCamera(puntero, camera);
    const [hit] = raycaster.intersectObjects([...objetos.values()], true);
    let o: Object3D | null = hit?.object ?? null;
    while (o && !o.userData.objeto) o = o.parent;
    const nombre = (o?.userData.objeto as Objeto | undefined) ?? null;
    return nombre && datos.enlaces[nombre] ? nombre : null;
  }

  let mx = 0;
  let my = 0;
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    const nombre = objetoBajo(e);
    resaltar(nombre);
    canvas.style.cursor = nombre ? "pointer" : "";
  });
  canvas.addEventListener("pointerleave", () => {
    mx = 0;
    my = 0;
    resaltar(null);
  });
  // El canvas está dentro del enlace al inicio: si el clic cae en un
  // objeto con sección, vamos a esa sección en vez de al inicio.
  enlace.addEventListener("click", (e) => {
    if (!(e instanceof PointerEvent) || e.target !== canvas) return;
    const nombre = objetoBajo(e);
    const href = nombre ? datos.enlaces[nombre] : null;
    if (href) {
      e.preventDefault();
      guardarCamara();
      location.href = href;
    }
  });

  // Menú → escena: pasar o enfocar un enlace resalta su objeto.
  for (const a of document.querySelectorAll<HTMLAnchorElement>(
    "[data-objeto]",
  )) {
    const nombre = a.dataset.objeto as Objeto;
    const on = () => resaltar(objetos.has(nombre) ? nombre : null);
    const off = () => resaltar(null);
    a.addEventListener("pointerenter", on);
    a.addEventListener("focus", on);
    a.addEventListener("pointerleave", off);
    a.addEventListener("blur", off);
  }

  /* ---------- Cámara: viaja desde la página anterior ---------- */
  const [destino, mirarDestino] = ENCUADRES[datos.foco] ?? ENCUADRES.general;
  const pos = destino.clone();
  const mirar = mirarDestino.clone();
  try {
    const previa = JSON.parse(sessionStorage.getItem(CLAVE_CAMARA) ?? "null");
    if (previa) {
      pos.fromArray(previa.pos);
      mirar.fromArray(previa.mirar);
    }
  } catch {
    /* sin sessionStorage: empieza directamente en el encuadre */
  }
  function guardarCamara() {
    try {
      sessionStorage.setItem(
        CLAVE_CAMARA,
        JSON.stringify({
          pos: destino.toArray(),
          mirar: mirarDestino.toArray(),
        }),
      );
    } catch {
      /* no pasa nada */
    }
  }
  addEventListener("pagehide", guardarCamara);

  /* ---------- Tamaño ---------- */
  function ajustar() {
    const { width, height } = marco.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(marco);
  ajustar();

  /* ---------- Bucle (pausado si la pestaña no se ve) ---------- */
  const inicio = performance.now();
  const objetivoPos = new Vector3();
  const objetivoMirar = new Vector3();
  let primerCuadro = true;

  let anterior = performance.now();

  function cuadro() {
    const ahora = performance.now();
    const t = (ahora - inicio) / 1000;
    // Suavizado según el tiempo real (no según los cuadros por segundo):
    // la cámara tarda lo mismo en llegar en un equipo rápido o en uno lento.
    const dt = Math.min((ahora - anterior) / 1000, 0.1);
    anterior = ahora;
    const k = 1 - Math.exp(-dt * 3.5);
    objetivoPos.copy(destino).add(new Vector3(mx * 0.18, -my * 0.08, 0));
    objetivoMirar.copy(mirarDestino).add(new Vector3(mx * 0.06, 0, 0));
    pos.lerp(objetivoPos, k);
    mirar.lerp(objetivoMirar, k);
    camera.position.copy(pos);
    camera.lookAt(mirar);

    for (const v of vapor) {
      const p = (t * 0.22 + v.f) % 1;
      v.m.position.set(
        1 + Math.sin(t * 2 + v.f * 20) * 0.05 * p,
        1.2 + p * 0.75,
        0.15 + Math.cos(t * 1.7 + v.f * 20) * 0.03 * p,
      );
      v.m.material.opacity = Math.sin(p * Math.PI);
    }
    luzLampara.intensity = 14 + Math.sin(t * 3) * 0.3;

    renderer.render(scene, camera);
    if (primerCuadro) {
      primerCuadro = false;
      marco.classList.add("con-3d");
    }
  }

  const arrancar = () => renderer.setAnimationLoop(cuadro);
  const parar = () => renderer.setAnimationLoop(null);
  document.addEventListener("visibilitychange", () =>
    document.visibilityState === "hidden" ? parar() : arrancar(),
  );

  // Si la GPU pierde el contexto, volvemos a la ilustración.
  canvas.addEventListener("webglcontextlost", () => {
    parar();
    marco.classList.remove("con-3d");
  });

  // Si la ventana se vuelve estrecha o se pide reducir movimiento, también.
  for (const q of [
    "(min-width: 64rem)",
    "(prefers-reduced-motion: no-preference)",
  ]) {
    matchMedia(q).addEventListener("change", (e) => {
      if (e.matches) {
        marco.classList.add("con-3d");
        arrancar();
      } else {
        parar();
        marco.classList.remove("con-3d");
      }
    });
  }

  arrancar();
}

/* Dibuja la pantalla del monitor con el estado y las últimas entradas. */
function dibujarPantalla(
  lienzo: HTMLCanvasElement,
  textura: CanvasTexture,
  datos: DatosEscena,
) {
  const g = lienzo.getContext("2d");
  if (!g) return;
  const fuente = (peso: number, tam: number, familia: string) =>
    `${peso} ${tam}px ${getComputedStyle(document.documentElement).getPropertyValue(familia) || "sans-serif"}`;

  g.fillStyle = "#262928";
  g.fillRect(0, 0, 1024, 600);
  g.fillStyle = "#F5E8D5";
  g.font = fuente(700, 56, "--font-outfit");
  g.fillText("Commit", 56, 104);
  const ancho = g.measureText("Commit").width;
  g.fillStyle = "#E8913F";
  g.fillText("&", 56 + ancho, 104);
  g.fillStyle = "#F5E8D5";
  g.fillText("Cafe", 56 + ancho + g.measureText("&").width, 104);

  g.fillStyle = "#E8913F";
  g.beginPath();
  g.arc(62, 152, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#B8AE9E";
  g.font = fuente(400, 28, "--font-figtree");
  g.fillText(`Ahora: ${recortar(g, datos.ahora, 860)}`, 84, 162);

  if (datos.entradas.length === 0) {
    g.fillStyle = "#B8AE9E";
    g.font = fuente(400, 32, "--font-figtree");
    g.fillText("El primer commit está en camino.", 56, 300);
  }
  datos.entradas.forEach((e, i) => {
    const y = 250 + i * 88;
    g.fillStyle = "#1B1D1C";
    g.fillRect(56, y - 44, 912, 2);
    g.fillStyle = "#B8AE9E";
    g.font = fuente(400, 26, "--font-jetbrains");
    g.fillText(e.hash, 56, y + 10);
    g.fillStyle = "#F5E8D5";
    g.font = fuente(600, 34, "--font-outfit");
    g.fillText(recortar(g, e.title, 740), 220, y + 10);
  });
  textura.needsUpdate = true;
}

function recortar(g: CanvasRenderingContext2D, texto: string, max: number) {
  if (g.measureText(texto).width <= max) return texto;
  let t = texto;
  while (t.length > 1 && g.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t}…`;
}
