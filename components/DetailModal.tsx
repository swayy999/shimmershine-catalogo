import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { CloseIcon, WhatsappIcon } from "./icons";
import { ImageTile } from "./ImageTile";
import AvailabilityTag from "./AvailabilityTag";

export default function DetailModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  return (
    <div
      className={`modal-overlay${product ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </button>
        {product && (
          <div className="modal-grid">
            <div>
              <ImageTile images={product.imagenes} alt={product.nombre} tileClassName="modal-tile" />
            </div>
            <div>
              <p className="card-no">N.º {String(product.no).padStart(3, "0")}</p>
              <AvailabilityTag value={product.disponibilidad} />
              <h2 className="modal-name">{product.nombre || "Pieza sin nombre"}</h2>
              <p className="modal-material">
                {product.material}
                {product.categoria ? ` · ${product.categoria}` : ""}
              </p>
              {product.talla && <p className="card-size">Talla: {product.talla}</p>}
              {product.descripcion && <p className="modal-desc">{product.descripcion}</p>}
              <p className="modal-price">{formatPrice(product.precio)}</p>
              <a
                className="whatsapp-btn large"
                href={buildWhatsappLink(product.no, product.nombre)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon />
                Consultar por esta pieza
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
