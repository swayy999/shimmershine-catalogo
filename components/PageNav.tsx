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
        <p className="page-nav-count">
          {page ? `${page.productos.length} pieza${page.productos.length === 1 ? "" : "s"}` : ""}
        </p>
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
