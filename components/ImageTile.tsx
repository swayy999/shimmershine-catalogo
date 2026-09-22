"use client";

import { useRef, useState } from "react";
import { GemIcon } from "./icons";

// Foto con zoom que sigue al cursor (transform-origin dinámico) y miniaturas
// cuando el producto tiene más de una imagen. Se usa tanto en la tarjeta de
// la grilla como en la ficha de detalle.
export function ImageTile({
  images,
  alt,
  tileClassName,
}: {
  images: string[];
  alt: string;
  tileClassName: string;
}) {
  const [active, setActive] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const img = imgRef.current;
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }

  return (
    <>
      <div className={tileClassName} onMouseMove={handleMouseMove}>
        {images.length ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imgRef} src={images[active]} alt={alt} loading="lazy" />
        ) : (
          <GemIcon />
        )}
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`thumb${i === active ? " active" : ""}`}
              aria-label={`Ver foto ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
