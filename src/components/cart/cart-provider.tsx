"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, CartProduct } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gfs-variemix-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch {
          setItems([]);
        }
      }
      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotalCents: items.reduce((total, item) => total + item.priceCents * item.quantity, 0),
      addItem(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.sku === product.sku);
          if (!existing) {
            return [...current, { ...product, quantity: Math.min(quantity, product.stock || quantity) }];
          }

          return current.map((item) =>
            item.sku === product.sku
              ? {
                  ...item,
                  ...product,
                  quantity: Math.min(item.quantity + quantity, product.stock || item.quantity + quantity),
                }
              : item,
          );
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.id !== productId));
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || quantity)) }
              : item,
          ),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider");
  }
  return context;
}
