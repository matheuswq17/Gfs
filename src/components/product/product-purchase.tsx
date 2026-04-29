"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { CartProduct } from "@/lib/types";

export function ProductPurchase({ product }: { product: CartProduct }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-[#20a33a]">{product.stock} unidades disponiveis</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 overflow-hidden rounded-lg border border-[#dbe4f0]">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid w-12 place-items-center bg-[#f7f9fc] text-[#202838] hover:bg-[#edf4fb]"
            aria-label="Diminuir quantidade"
          >
            <Minus size={17} />
          </button>
          <span className="grid w-14 place-items-center bg-white text-sm font-black">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
            className="grid w-12 place-items-center bg-[#f7f9fc] text-[#202838] hover:bg-[#edf4fb]"
            aria-label="Aumentar quantidade"
          >
            <Plus size={17} />
          </button>
        </div>
        <AddToCartButton product={product} quantity={quantity} className="h-12 flex-1" />
      </div>
      <p className="mt-3 text-xs leading-5 text-[#66758a]">
        O estoque e recalculado no checkout antes de criar o pedido.
      </p>
    </div>
  );
}
