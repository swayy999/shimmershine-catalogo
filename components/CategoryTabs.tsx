import type { CategoryPage } from "@/lib/products";

export default function CategoryTabs({
  pages,
  currentPage,
  onSelect,
}: {
  pages: CategoryPage[];
  currentPage: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <nav className="cat-tabs">
      {pages.map((page, idx) => (
        <button
          key={page.categoria}
          type="button"
          className={`cat-chip${idx === currentPage ? " active" : ""}`}
          onClick={() => onSelect(idx)}
        >
          {page.categoria}
        </button>
      ))}
    </nav>
  );
}
