"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

const fallbackImage = "/products/figurinhas-copa-2026-panini-1.jpeg";

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const gallery = images.length > 0 ? images : [{ id: "fallback", url: fallbackImage, alt: productName }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = gallery[selectedIndex] ?? gallery[0];

  return (
    <div>
      <div className="motion-card overflow-hidden rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm">
        <Image
          key={selected.url}
          src={selected.url}
          alt={selected.alt || productName}
          width={900}
          height={700}
          priority
          className="gallery-main-image aspect-[1.18] w-full rounded-lg object-cover transition duration-300"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {gallery.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={clsx(
                  "thumbnail-button group rounded-lg border bg-white p-1 text-left shadow-sm hover:border-[#063f8f] focus:outline-none focus:ring-2 focus:ring-[#f4b227]",
                  isSelected ? "border-[#063f8f] ring-2 ring-[#f4b227]/70" : "border-[#dbe4f0]",
                )}
                aria-label={`Ver imagem ${index + 1} de ${productName}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={image.url}
                  alt={image.alt || productName}
                  width={220}
                  height={170}
                  className={clsx(
                    "aspect-[1.2] w-full rounded-md object-cover transition duration-300",
                    isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
