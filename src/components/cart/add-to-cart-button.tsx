"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { CartProduct } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
}: {
  product: CartProduct;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={product.stock <= 0}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-4 text-sm font-black text-white transition hover:bg-[#073271] disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
    >
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {product.stock <= 0 ? "Indisponivel" : added ? "Adicionado" : "Comprar"}
    </button>
  );
}
