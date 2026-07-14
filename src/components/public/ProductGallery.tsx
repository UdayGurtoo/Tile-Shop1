"use client";

import { useState } from "react";
import { OptimizedImage } from "./OptimizedImage";

type Image = { url: string; alt: string };

type Props = {
  images: Image[];
};

export function ProductGallery({ images }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!images.length) {
    return (
      <div
        className="product-gallery-main"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}
      >
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="product-gallery-main" style={{ position: "relative" }}>
        <OptimizedImage
          src={current.url}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          thumbWidth={800}
        />
      </div>
      {images.length > 1 && (
        <div className="product-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`product-gallery-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
            >
              <OptimizedImage
                src={img.url}
                alt={img.alt}
                width={72}
                height={72}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                thumbWidth={150}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
