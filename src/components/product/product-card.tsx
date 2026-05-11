import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/types";

export function ProductCard({ product, index = 0 }: { product: ProductWithRelations; index?: number }) {
  const image = product.images[0]?.url || "/products/figurinhas-copa-2026-panini-1.jpeg";
  const style = { "--stagger-delay": `${Math.min(index * 42, 180)}ms` } as CSSProperties;

  return (
    <article
      style={style}
      className="product-card motion-card feature-card group flex h-full flex-col rounded-lg border border-[#dbe4f0] bg-white shadow-sm hover:border-[#b9c8db]"
    >
      <Link href={`/produtos/${product.slug}`} className="product-card-link block overflow-hidden rounded-t-lg bg-[#f3f7fc] transition">
        <Image
          src={image}
          alt={product.images[0]?.alt || product.name}
          width={720}
          height={560}
          className="product-card-image aspect-[1.2] w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-md bg-[#edf4fb] px-2 py-1 text-[11px] font-black uppercase text-[#063f8f]">
            {product.category.name}
          </span>
          <span className="text-xs font-bold text-[#66758a]">SKU {product.sku}</span>
        </div>
        <Link href={`/produtos/${product.slug}`} className="mt-3">
          <h3 className="font-display text-lg font-black leading-6 text-[#202838]">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5e6a7d]">{product.shortDescription}</p>
        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[#66758a]">Preco</p>
              <p className="font-display text-2xl font-black text-[#063f8f]">{formatPrice(product.priceCents)}</p>
            </div>
            <p className="text-xs font-bold text-[#20a33a]">{product.stock} em estoque</p>
          </div>
          <AddToCartButton
            className="button-shine interactive-button w-full"
            product={{
              id: product.id,
              name: product.name,
              sku: product.sku,
              slug: product.slug,
              priceCents: product.priceCents,
              image,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </article>
  );
}
