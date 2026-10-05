import { normalizeHeader, parseCsv } from "./csv";
import lotesLocales from "./lotes-locales.json";

export type Lote = {
  id: string;
  imagen: string;
  titulo: string;
};

// Fotos de lotes completos (venta al por mayor) por categoría.
//
// Se leen desde una segunda pestaña de la misma planilla ("lotes"), publicada
// como CSV en GOOGLE_SHEET_LOTES_CSV_URL, con columnas categoria, titulo y
// url_imagen (URL de Cloudinary). Así quien sube las fotos a Cloudinary solo
// tiene que agregar una fila en la planilla — sin tocar código ni desplegar.
//
// Mientras esa variable no esté configurada, se usa la lista fija de
// lotes-locales.json (fotos en public/lotes/<categoria>/).
//
// Una categoría que no está en la planilla de productos (p. ej. "Dijes") igual
// aparece como página propia, mostrando solo sus lotes.
export async function getLotesPorCategoria(): Promise<Map<string, Lote[]>> {
  const csvUrl = process.env.GOOGLE_SHEET_LOTES_CSV_URL;
  if (!csvUrl) return new Map(Object.entries(lotesLocales as Record<string, Lote[]>));

  const res = await fetch(csvUrl, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`No se pudo leer el CSV de lotes de la planilla (HTTP ${res.status}).`);
  }
  const rows = parseCsv(await res.text());
  if (rows.length < 2) return new Map();

  const header = rows[0].map(normalizeHeader);
  const colCategoria = header.indexOf("categoria");
  const colTitulo = header.indexOf("titulo");
  const colImagen = header.findIndex((h) =>
    ["url_imagen", "url_imagen_cloudinary", "imagen_url", "imagen"].includes(h)
  );

  const porCategoria = new Map<string, Lote[]>();
  rows.slice(1).forEach((row, i) => {
    const categoria = (row[colCategoria] ?? "").trim();
    const imagen = (row[colImagen] ?? "").trim();
    if (!categoria || !/^https?:\/\//i.test(imagen)) return;

    const lotes = porCategoria.get(categoria) ?? [];
    const titulo = (row[colTitulo] ?? "").trim() || `Lote de ${categoria.toLowerCase()} ${lotes.length + 1}`;
    lotes.push({ id: `lote-${i + 1}`, imagen, titulo });
    porCategoria.set(categoria, lotes);
  });
  return porCategoria;
}
