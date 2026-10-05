import type { CategoryPage } from "@/lib/products";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

export default function PageNav({
  page,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: {
  page: CategoryPage | undefined;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const piezas = page ? page.productos.length : 0;
  const lotes = page && !piezas ? page.lotes.length : 0;
  const count = !page
    ? ""
    : lotes
      ? `${lotes} lote${lotes === 1 ? "" : "s"}`
      : `${piezas} pieza${piezas === 1 ? "" : "s"}`;

  return (
    <div className="page-nav">
      <button
        type="button"
        className="page-nav-arrow"
        onClick={onPrev}
        disabled={currentPage === 0}
        aria-label="Página anterior"
      >
        <ArrowLeftIcon />
        Anterior
      </button>
      <div className="page-nav-center">
        <p className="page-nav-cat">{page ? page.categoria : "—"}</p>
        <p className="page-nav-count">{count}</p>
      </div>
      <button
        type="button"
        className="page-nav-arrow"
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        aria-label="Página siguiente"
      >
        Siguiente
        <ArrowRightIcon />
      </button>
    </div>
  );
}
