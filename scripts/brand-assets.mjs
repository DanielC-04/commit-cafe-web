// Genera los archivos de marca que la web necesita a partir de los SVG del kit:
//   public/favicon.ico          (32 px, para navegadores que lo piden por defecto)
//   public/apple-touch-icon.png (180 px, iPhone/iPad)
//   public/brand/og-default.png (1200x630, vista previa en redes)
// Se ejecuta a mano cuando cambie el logo:  pnpm brand
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const CARBON = "#1B1D1C";
const icono = await readFile("public/brand/icono.svg");
const horizontal = await readFile("public/brand/horizontal.svg");

// favicon.ico: un ICO puede llevar un PNG dentro; solo hay que añadir la
// cabecera (6 bytes) y una entrada de directorio (16 bytes).
const png32 = await sharp(icono, { density: 300 })
  .resize(32, 32)
  .png()
  .toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: icono
header.writeUInt16LE(1, 4); // número de imágenes
header.writeUInt8(32, 6); // ancho
header.writeUInt8(32, 7); // alto
header.writeUInt16LE(1, 10); // planos de color
header.writeUInt16LE(32, 12); // bits por píxel
header.writeUInt32LE(png32.length, 14); // tamaño de la imagen
header.writeUInt32LE(22, 18); // dónde empieza la imagen
await writeFile("public/favicon.ico", Buffer.concat([header, png32]));

// apple-touch-icon: iOS no respeta la transparencia, así que va sobre carbón.
await sharp(icono, { density: 300 })
  .resize(180, 180)
  .flatten({ background: CARBON })
  .png()
  .toFile("public/apple-touch-icon.png");

// og-default: logo horizontal centrado sobre carbón, con margen.
const logo = await sharp(horizontal, { density: 300 })
  .resize({ width: 900 })
  .png()
  .toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: CARBON },
})
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toFile("public/brand/og-default.png");

console.log("Listo: favicon.ico, apple-touch-icon.png y brand/og-default.png");
