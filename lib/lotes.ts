export type Lote = {
  id: string;
  imagen: string;
  titulo: string;
};

// Fotos de lotes completos (venta al por mayor) por categoría. Agregar más
// categorías acá cuando haya fotos de sus lotes en public/lotes/<categoria>/.
// Una categoría que no está en la planilla (p. ej. "Dijes") igual aparece
// como página propia, mostrando solo sus lotes.
const LOTES_POR_CATEGORIA: Record<string, Lote[]> = {
  Aros: [
    { id: "coleccion-aros-1", imagen: "/lotes/aros/coleccion-aros-1.png", titulo: "Colección de aros 1" },
    { id: "coleccion-aros-2", imagen: "/lotes/aros/coleccion-aros-2.png", titulo: "Colección de aros 2" },
    { id: "coleccion-aros-3", imagen: "/lotes/aros/coleccion-aros-3.png", titulo: "Colección de aros 3" },
    { id: "aros-4", imagen: "/lotes/aros/aros-4.png", titulo: "Lote de aros 4" },
    { id: "aros-5", imagen: "/lotes/aros/aros-5.png", titulo: "Lote de aros 5" },
    { id: "aros-6", imagen: "/lotes/aros/aros-6.png", titulo: "Lote de aros 6" },
    { id: "aros-7", imagen: "/lotes/aros/aros-7.png", titulo: "Lote de aros 7" },
    { id: "aros-8", imagen: "/lotes/aros/aros-8.png", titulo: "Lote de aros 8" },
    { id: "aros-9", imagen: "/lotes/aros/aros-9.png", titulo: "Lote de aros 9" },
    { id: "aros-10", imagen: "/lotes/aros/aros-10.png", titulo: "Lote de aros 10" },
    { id: "aros-11", imagen: "/lotes/aros/aros-11.png", titulo: "Lote de aros 11" },
    { id: "aros-12", imagen: "/lotes/aros/aros-12.png", titulo: "Lote de aros 12" },
    { id: "aros-13", imagen: "/lotes/aros/aros-13.png", titulo: "Lote de aros 13" },
    { id: "aros-14", imagen: "/lotes/aros/aros-14.png", titulo: "Lote de aros 14" },
    { id: "aros-pegados-15", imagen: "/lotes/aros/aros-pegados-15.png", titulo: "Lote de aros pegados 15" },
    { id: "aros-16", imagen: "/lotes/aros/aros-16.png", titulo: "Lote de aros 16" },
    { id: "aros-17", imagen: "/lotes/aros/aros-17.png", titulo: "Lote de aros 17" },
  ],
  Dijes: [
    { id: "dijes-1", imagen: "/lotes/dijes/dijes-1.png", titulo: "Lote de dijes 1" },
    { id: "dijes-2", imagen: "/lotes/dijes/dijes-2.png", titulo: "Lote de dijes 2" },
    { id: "dijes-3", imagen: "/lotes/dijes/dijes-3.png", titulo: "Lote de dijes 3" },
    { id: "dijes-4", imagen: "/lotes/dijes/dijes-4.png", titulo: "Lote de dijes 4" },
    { id: "dijes-5", imagen: "/lotes/dijes/dijes-5.png", titulo: "Lote de dijes 5" },
  ],
  Cadenas: [
    { id: "cadenas-1", imagen: "/lotes/cadenas/cadenas-1.jpg", titulo: "Lote de cadenas 1" },
    { id: "cadenas-2", imagen: "/lotes/cadenas/cadenas-2.jpg", titulo: "Lote de cadenas 2" },
    { id: "cadenas-3", imagen: "/lotes/cadenas/cadenas-3.jpg", titulo: "Lote de cadenas 3" },
    { id: "cadenas-4", imagen: "/lotes/cadenas/cadenas-4.jpg", titulo: "Lote de cadenas 4" },
    { id: "cadenas-5", imagen: "/lotes/cadenas/cadenas-5.jpg", titulo: "Lote de cadenas 5" },
  ],
  Pulseras: [
    { id: "pulseras-1", imagen: "/lotes/pulseras/pulseras-1.jpg", titulo: "Lote de pulseras 1" },
    { id: "pulseras-2", imagen: "/lotes/pulseras/pulseras-2.jpg", titulo: "Lote de pulseras 2" },
    { id: "pulseras-3", imagen: "/lotes/pulseras/pulseras-3.jpg", titulo: "Lote de pulseras 3" },
    { id: "pulseras-4", imagen: "/lotes/pulseras/pulseras-4.jpg", titulo: "Lote de pulseras 4" },
    { id: "pulseras-5", imagen: "/lotes/pulseras/pulseras-5.jpg", titulo: "Lote de pulseras 5" },
    { id: "pulseras-6", imagen: "/lotes/pulseras/pulseras-6.jpg", titulo: "Lote de pulseras 6" },
    { id: "pulseras-7", imagen: "/lotes/pulseras/pulseras-7.jpg", titulo: "Lote de pulseras 7" },
    { id: "pulseras-8", imagen: "/lotes/pulseras/pulseras-8.jpg", titulo: "Lote de pulseras 8" },
    { id: "pulseras-9", imagen: "/lotes/pulseras/pulseras-9.jpg", titulo: "Lote de pulseras 9" },
    { id: "pulseras-10", imagen: "/lotes/pulseras/pulseras-10.jpg", titulo: "Lote de pulseras 10" },
    { id: "pulseras-11", imagen: "/lotes/pulseras/pulseras-11.jpg", titulo: "Lote de pulseras 11" },
    { id: "pulseras-12", imagen: "/lotes/pulseras/pulseras-12.jpg", titulo: "Lote de pulseras 12" },
    { id: "pulseras-13", imagen: "/lotes/pulseras/pulseras-13.jpg", titulo: "Lote de pulseras 13" },
    { id: "pulseras-14", imagen: "/lotes/pulseras/pulseras-14.jpg", titulo: "Lote de pulseras 14" },
    { id: "pulseras-15", imagen: "/lotes/pulseras/pulseras-15.jpg", titulo: "Lote de pulseras 15" },
    { id: "pulseras-16", imagen: "/lotes/pulseras/pulseras-16.jpg", titulo: "Lote de pulseras 16" },
    { id: "pulseras-17", imagen: "/lotes/pulseras/pulseras-17.jpg", titulo: "Lote de pulseras 17" },
  ],
};

export function getLotesForCategoria(categoria: string): Lote[] {
  return LOTES_POR_CATEGORIA[categoria] ?? [];
}

export function getCategoriasConLotes(): string[] {
  return Object.keys(LOTES_POR_CATEGORIA);
}
