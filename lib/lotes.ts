export type Lote = {
  id: string;
  imagen: string;
  titulo: string;
};

// Fotos de lotes completos (venta al por mayor) por categoría. Por ahora
// solo "Aros" tiene lotes fotografiados — agregar más categorías acá cuando
// haya fotos de sus lotes en public/lotes/<categoria>/.
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
};

export function getLotesForCategoria(categoria: string): Lote[] {
  return LOTES_POR_CATEGORIA[categoria] ?? [];
}
