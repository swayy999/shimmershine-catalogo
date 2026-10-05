"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryPage, Product } from "@/lib/products";
import CategoryTabs from "./CategoryTabs";
import PageNav from "./PageNav";
import ProductGrid from "./ProductGrid";
import LotesSection from "./LotesSection";
import DetailModal from "./DetailModal";

export default function Catalog({ pages }: { pages: CategoryPage[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goToPage = useCallback(
    (idx: number) => {
      if (!pages.length) return;
      const clamped = Math.max(0, Math.min(pages.length - 1, idx));
      if (clamped === currentPage) return;
      setFading(true);
      window.setTimeout(() => {
        setCurrentPage(clamped);
        setFading(false);
      }, 160);
    },
    [currentPage, pages.length]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
        return;
      }
      if (selected) return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goToPage(currentPage + 1);
      if (e.key === "ArrowLeft") goToPage(currentPage - 1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [currentPage, goToPage, selected]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goToPage(currentPage + (dx < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const page = pages[currentPage];
  const lotes = page ? page.lotes : [];

  return (
    <>
      <CategoryTabs pages={pages} currentPage={currentPage} onSelect={goToPage} />
      <PageNav
        page={page}
        currentPage={currentPage}
        totalPages={pages.length}
        onPrev={() => goToPage(currentPage - 1)}
        onNext={() => goToPage(currentPage + 1)}
      />
      <main
        className={`page-frame${fading ? " fading" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(!lotes.length || (page && page.productos.length > 0)) && (
          <ProductGrid productos={page ? page.productos : []} onOpen={setSelected} />
        )}
        <LotesSection lotes={lotes} />
      </main>
      <p className="swipe-hint">Usa las flechas del teclado o desliza para pasar de categoría</p>
      <DetailModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
