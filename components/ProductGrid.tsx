import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  productos,
  onOpen,
}: {
  productos: Product[];
  onOpen: (product: Product) => void;
}) {
  if (!productos.length) {
    return <p className="empty-state">No hay piezas para mostrar.</p>;
  }
  return (
    <div className="grid">
      {productos.map((p) => (
        <ProductCard key={p.no} product={p} onOpen={onOpen} />
      ))}
    </div>
  );
}
