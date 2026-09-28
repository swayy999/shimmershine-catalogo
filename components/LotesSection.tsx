"use client";

import { useEffect, useRef, useState } from "react";
import type { Lote } from "@/lib/lotes";
import { CloseIcon } from "./icons";

// Fotos de lotes completos (varias piezas juntas, venta al por mayor). Se
// muestran debajo de los productos individuales de la categoría; al hacer
// clic se abre la foto ampliada en un overlay simple.
export default function LotesSection({ lotes }: { lotes: Lote[] }) {
  const [zoomed, setZoomed] = useState<Lote | null>(null);
  const [superZoom, setSuperZoom] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  function closeZoom() {
    setZoomed(null);
    setSuperZoom(false);
  }

  function openZoom(lote: Lote) {
    setZoomed(lote);
    setSuperZoom(false);
  }

  useEffect(() => {
    if (!zoomed) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeZoom();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [zoomed]);

  // Al ampliar más, la imagen crece más allá del viewport y hay que poder
  // desplazarse por ella (para ver cada pieza del lote) — arranca centrada
  // en vez de pegada a la esquina superior izquierda.
  useEffect(() => {
    if (!superZoom) return;
    const el = overlayRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
  }, [superZoom]);

  if (!lotes.length) return null;

  return (
    <section className="lotes-section">
      <h2 className="lotes-heading">Lotes disponibles</h2>
      <p className="lotes-hint">Fotos de lotes completos. Haz clic en una foto para ampliarla.</p>
      <div className="lotes-grid">
        {lotes.map((lote) => (
          <button
            key={lote.id}
            type="button"
            className="lote-tile"
            onClick={() => openZoom(lote)}
            aria-label={`Ampliar ${lote.titulo}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lote.imagen} alt={lote.titulo} loading="lazy" />
          </button>
        ))}
      </div>

      <div
        ref={overlayRef}
        className={`lote-zoom-overlay${zoomed ? " open" : ""}${superZoom ? " zoomed-in" : ""}`}
        onClick={closeZoom}
      >
        {zoomed && (
          <>
            <button
              type="button"
              className="lote-zoom-close"
              aria-label="Cerrar"
              onClick={closeZoom}
            >
              <CloseIcon />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomed.imagen}
              alt={zoomed.titulo}
              className="lote-zoom-img"
              onClick={(e) => {
                e.stopPropagation();
                setSuperZoom((v) => !v);
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
