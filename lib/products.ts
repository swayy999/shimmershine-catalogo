import { normalizeHeader, parseCsv } from "./csv";
import type { Lote } from "./lotes";

export type Product = {
  no: number;
  categoria: string;
  nombre: string;
  material: string;
  precio: string;
  imagenes: string[];
  descripcion: string;
  disponibilidad: string;
  talla: string;
};

export type CategoryPage = {
  categoria: string;
  productos: Product[];
  lotes: Lote[];
};

// Alias aceptados por columna: la planilla puede usar cualquiera de estos
// encabezados (sin mayúsculas/tildes) y el catálogo los reconoce igual.
const COLUMN_ALIASES = {
  categoria: ["categoria"],
  nombre: ["nombre"],
  material: ["material"],
  precio: ["precio"],
  descripcion: ["descripcion"],
  disponibilidad: ["disponibilidad"],
  talla: ["talla"],
  url_imagen: ["url_imagen", "url_imagen_cloudinary", "imagen_url", "imagen"],
  archivo_imagen: ["archivo_imagen", "archivo_imagen_local", "imagen_archivo"],
} as const;

function findColumn(
  headerIndex: Record<string, number>,
  aliases: readonly string[]
): number | undefined {
  for (const alias of aliases) {
    if (alias in headerIndex) return headerIndex[alias];
  }
  return undefined;
}

// Si la fila trae una URL completa (columna url_imagen / url_imagen_cloudinary)
// se usa tal cual. Si solo trae el nombre de archivo local, se arma la URL de
// Cloudinary asumiendo que la foto fue subida con ese mismo nombre (sin
// extensión) como public_id dentro de la carpeta NEXT_PUBLIC_CLOUDINARY_FOLDER.
// Eso es justo lo que hace scripts/subir-fotos-a-cloudinary.mjs.
//
// Mientras no haya cloud name configurado, se sirve directo desde
// public/imagenes/ (mismo archivo que datos-fuente/imagenes/) para que el
// catálogo muestre fotos sin depender de tener Cloudinary ya configurado.
function cloudinaryFallbackUrl(filename: string): string | null {
  const trimmed = filename.trim();
  if (!trimmed) return null;

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return `/imagenes/${trimmed}`;

  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "shimmershine";
  const base = trimmed.replace(/\.[a-zA-Z0-9]+$/, "");
  if (!base) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${folder}/${base}`;
}

function resolveImages(rawUrl: string, rawArchivo: string): string[] {
  const fromUrlColumn = rawUrl
    .split("|")
    .map((s) => s.trim())
    .filter((u) => /^https?:\/\//i.test(u));
  if (fromUrlColumn.length) return fromUrlColumn;

  return rawArchivo
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(cloudinaryFallbackUrl)
    .filter((u): u is string => Boolean(u));
}

// Lee el CSV publicado de Google Sheets y arma las "páginas" tipo revista:
// una por categoría, en el orden en que aparecen las filas en la planilla.
export async function getCategoryPages(): Promise<CategoryPage[]> {
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;
  if (!csvUrl) {
    throw new Error(
      "Falta configurar la variable de entorno GOOGLE_SHEET_CSV_URL con el link del CSV publicado de Google Sheets."
    );
  }

  const res = await fetch(csvUrl, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`No se pudo leer el CSV de la planilla (HTTP ${res.status}).`);
  }
  const text = await res.text();
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const header = rows[0].map(normalizeHeader);
  const headerIndex: Record<string, number> = {};
  header.forEach((h, i) => {
    headerIndex[h] = i;
  });

  const col = {
    categoria: findColumn(headerIndex, COLUMN_ALIASES.categoria),
    nombre: findColumn(headerIndex, COLUMN_ALIASES.nombre),
    material: findColumn(headerIndex, COLUMN_ALIASES.material),
    precio: findColumn(headerIndex, COLUMN_ALIASES.precio),
    descripcion: findColumn(headerIndex, COLUMN_ALIASES.descripcion),
    disponibilidad: findColumn(headerIndex, COLUMN_ALIASES.disponibilidad),
    talla: findColumn(headerIndex, COLUMN_ALIASES.talla),
    url_imagen: findColumn(headerIndex, COLUMN_ALIASES.url_imagen),
    archivo_imagen: findColumn(headerIndex, COLUMN_ALIASES.archivo_imagen),
  };

  const cell = (row: string[], idx: number | undefined) =>
    idx === undefined ? "" : (row[idx] ?? "").trim();

  const byCategory = new Map<string, Product[]>();
  const order: string[] = [];
  let no = 0;

  for (const row of rows.slice(1)) {
    const nombre = cell(row, col.nombre);
    if (!nombre) continue;

    no += 1;
    const categoria = cell(row, col.categoria) || "Sin categoría";
    const product: Product = {
      no,
      categoria,
      nombre,
      material: cell(row, col.material),
      precio: cell(row, col.precio),
      imagenes: resolveImages(cell(row, col.url_imagen), cell(row, col.archivo_imagen)),
      descripcion: cell(row, col.descripcion),
      disponibilidad: cell(row, col.disponibilidad),
      talla: cell(row, col.talla),
    };

    if (!byCategory.has(categoria)) {
      byCategory.set(categoria, []);
      order.push(categoria);
    }
    byCategory.get(categoria)!.push(product);
  }

  return order.map((categoria) => ({ categoria, productos: byCategory.get(categoria)!, lotes: [] }));
}
