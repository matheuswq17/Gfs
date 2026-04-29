"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export function CartPage() {
  const { items, subtotalCents, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className="container-gfs py-14">
        <div className="rounded-lg border border-dashed border-[#b9c8db] bg-white p-12 text-center">
          <ShoppingBag className="mx-auto text-[#063f8f]" size={40} />
          <h1 className="mt-4 font-display text-3xl font-black text-[#202838]">Seu carrinho esta vazio</h1>
          <p className="mt-2 text-[#5e6a7d]">Escolha produtos no catalogo para iniciar uma compra real.</p>
          <Link
            href="/produtos"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-[#063f8f] px-6 text-sm font-black text-white"
          >
            Ver catalogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-gfs py-12">
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Carrinho</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Revise sua compra</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="grid gap-4 rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm md:grid-cols-[132px_1fr_auto]">
              <Image src={item.image} alt={item.name} width={180} height={140} className="aspect-[1.2] rounded-lg object-cover" />
              <div>
                <Link href={`/produtos/${item.slug}`} className="font-display text-xl font-black text-[#202838]">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-[#66758a]">SKU {item.sku}</p>
                <p className="mt-3 font-display text-2xl font-black text-[#063f8f]">{formatPrice(item.priceCents)}</p>
              </div>
              <div className="flex items-center gap-3 md:flex-col md:items-end md:justify-between">
                <div className="flex h-10 overflow-hidden rounded-lg border border-[#dbe4f0]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="grid w-10 place-items-center bg-[#f7f9fc]"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="grid w-12 place-items-center text-sm font-black">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="grid w-10 place-items-center bg-[#f7f9fc]"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#dbe4f0] px-3 text-sm font-black text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-black text-[#202838]">Resumo</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#66758a]">Subtotal</span>
              <span className="font-black text-[#202838]">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758a]">Frete</span>
              <span className="font-black text-[#202838]">A combinar</span>
            </div>
          </div>
          <div className="mt-5 border-t border-[#edf2f8] pt-5">
            <div className="flex justify-between">
              <span className="font-black text-[#202838]">Total dos itens</span>
              <span className="font-display text-2xl font-black text-[#063f8f]">{formatPrice(subtotalCents)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#20a33a] px-5 text-sm font-black text-white transition hover:bg-[#188a30]"
          >
            Finalizar compra
          </Link>
          <Link
            href="/produtos"
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#dbe4f0] px-5 text-sm font-black text-[#202838] transition hover:bg-[#edf4fb]"
          >
            Continuar comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}
