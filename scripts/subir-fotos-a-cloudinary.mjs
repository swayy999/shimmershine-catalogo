#!/usr/bin/env node
// Sube las fotos locales del catálogo a Cloudinary y regenera el CSV con las
// URLs resultantes en la columna url_imagen_cloudinary.
//
// Variables de entorno necesarias (ponerlas en .env.local, en la raíz del
// proyecto, o exportarlas antes de correr el script):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
//   (o una sola: CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>)
//
// Uso:
//   npm run subir-fotos
//
// Por defecto lee las fotos desde datos-fuente/imagenes/ y el CSV desde
// datos-fuente/productos_shimmershine.csv, y escribe
// datos-fuente/productos_shimmershine.con-urls.csv con la columna
// url_imagen_cloudinary completada. Ese archivo es el que después pegas o
// importas en tu Google Sheet publicado.
//
// El public_id de cada imagen en Cloudinary es el nombre de archivo sin
// extensión, dentro de la carpeta CLOUDINARY_FOLDER (por defecto
// "shimmershine"). Si mantienes esa convención, el catálogo puede armar la
// URL de Cloudinary automáticamente a partir de archivo_imagen_local aunque
// no llenes la columna url_imagen_cloudinary (ver lib/products.ts).

import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

loadDotEnvLocal();

const CLOUD_FOLDER = process.env.CLOUDINARY_FOLDER || "shimmershine";
const IMAGES_DIR = process.env.IMAGENES_DIR || path.join(ROOT, "datos-fuente", "imagenes");
const CSV_IN = process.env.CSV_ENTRADA || path.join(ROOT, "datos-fuente", "productos_shimmershine.csv");
const CSV_OUT =
  process.env.CSV_SALIDA || path.join(ROOT, "datos-fuente", "productos_shimmershine.con-urls.csv");
const CACHE_FILE = path.join(ROOT, "datos-fuente", ".cloudinary-cache.json");

const tieneCredenciales =
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (!tieneCredenciales) {
  console.error(
    "Faltan credenciales de Cloudinary. Define CLOUDINARY_URL o CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET en .env.local."
  );
  process.exit(1);
}

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function main() {
  if (!fs.existsSync(CSV_IN)) {
    console.error(`No encuentro el CSV de entrada: ${CSV_IN}`);
    process.exit(1);
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`No encuentro la carpeta de imágenes: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const cache = loadCache();
  const { header, rows, delimiter } = parseCsv(fs.readFileSync(CSV_IN, "utf8"));

  const idxArchivo = findHeaderIndex(header, ["archivo_imagen_local", "archivo_imagen"]);
  const idxUrl = findHeaderIndex(header, ["url_imagen_cloudinary", "url_imagen"]);

  if (idxArchivo === -1) {
    console.error("El CSV no tiene columna archivo_imagen_local / archivo_imagen.");
    process.exit(1);
  }
  if (idxUrl === -1) {
    console.error("El CSV no tiene columna url_imagen_cloudinary / url_imagen.");
    process.exit(1);
  }

  let subidas = 0;
  let reutilizadas = 0;
  let sinImagen = 0;

  for (const row of rows) {
    const filenames = (row[idxArchivo] || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!filenames.length) {
      sinImagen++;
      continue;
    }

    const urls = [];
    for (const filename of filenames) {
      if (cache[filename]) {
        urls.push(cache[filename]);
        reutilizadas++;
        continue;
      }

      const localPath = path.join(IMAGES_DIR, filename);
      if (!fs.existsSync(localPath)) {
        console.warn(`  ! No encontré la imagen local: ${filename}`);
        continue;
      }

      const publicId = filename.replace(/\.[a-zA-Z0-9]+$/, "");
      process.stdout.write(`Subiendo ${filename}... `);
      const result = await cloudinary.uploader.upload(localPath, {
        folder: CLOUD_FOLDER,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });
      console.log("OK");

      cache[filename] = result.secure_url;
      urls.push(result.secure_url);
      subidas++;
      saveCache(cache);
    }

    row[idxUrl] = urls.join("|");
  }

  fs.writeFileSync(CSV_OUT, stringifyCsv(header, rows, delimiter), "utf8");

  console.log("");
  console.log(`Listo. Subidas: ${subidas} · Reutilizadas de caché: ${reutilizadas} · Filas sin imagen: ${sinImagen}`);
  console.log(`CSV generado: ${CSV_OUT}`);
  console.log("Copia esa columna (o todo el archivo) a tu Google Sheet publicado como CSV.");
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

function loadDotEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function findHeaderIndex(header, aliases) {
  const normalized = header.map((h) => h.trim().toLowerCase());
  for (const alias of aliases) {
    const i = normalized.indexOf(alias);
    if (i !== -1) return i;
  }
  return -1;
}

// ---- CSV mínimo (soporta , o ; y campos entre comillas) ----
function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const commas = (firstLine.match(/,/g) || []).length;
  const semicolons = (firstLine.match(/;/g) || []).length;
  return semicolons > commas ? ";" : ",";
}

function parseCsv(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === delimiter) {
      pushField();
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      pushRow();
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length || row.length) pushRow();
  const filtered = rows.filter((r) => r.some((c) => c.trim() !== ""));
  const [header, ...dataRows] = filtered;
  return { header, rows: dataRows, delimiter };
}

function csvEscape(value, delimiter) {
  const str = String(value ?? "");
  if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function stringifyCsv(header, rows, delimiter) {
  const lines = [header, ...rows].map((row) => row.map((cell) => csvEscape(cell, delimiter)).join(delimiter));
  return lines.join("\n") + "\n";
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
