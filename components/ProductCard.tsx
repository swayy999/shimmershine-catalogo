import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { WhatsappIcon } from "./icons";
import { ImageTile } from "./ImageTile";
import AvailabilityTag from "./AvailabilityTag";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const no = String(product.no).padStart(3, "0");

  return (
    <div className="card" onClick={() => onOpen(product)}>
      <ImageTile images={product.imagenes} alt={product.nombre} tileClassName="tile" />
      <p className="card-no">N.º {no}</p>
      <AvailabilityTag value={product.disponibilidad} />
      <p className="card-name">{product.nombre || "Pieza sin nombre"}</p>
      <p className="card-material">{product.material}</p>
      {product.talla && <p className="card-size">Talla: {product.talla}</p>}
      {product.descripcion && <p className="card-desc">{product.descripcion}</p>}
      <p className="card-price">{formatPrice(product.precio)}</p>
      <a
        className="whatsapp-btn"
        href={buildWhatsappLink(product.no, product.nombre)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        <WhatsappIcon />
        Consultar
      </a>
      <p className="card-detail-link">Ver detalle →</p>
    </div>
  );
}
