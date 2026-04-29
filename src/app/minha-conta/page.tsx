import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatPrice, orderStatusLabel, paymentStatusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Minha conta",
};

export default async function AccountPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="container-gfs py-12">
      <div className="rounded-lg bg-[#063f8f] p-7 text-white">
        <p className="text-sm font-black uppercase text-[#f4b227]">Minha conta</p>
        <h1 className="mt-2 font-display text-4xl font-black">{user.name}</h1>
        <p className="mt-2 text-white/72">{user.email}</p>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-[#20a33a]">Historico</p>
          <h2 className="mt-2 font-display text-3xl font-black text-[#202838]">Meus pedidos</h2>
        </div>
        <Link href="/produtos" className="rounded-lg bg-[#f4b227] px-5 py-3 text-sm font-black text-[#202838]">
          Comprar novamente
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-[#b9c8db] bg-white p-10 text-center">
          <h3 className="font-display text-2xl font-black text-[#202838]">Nenhum pedido por aqui ainda</h3>
          <p className="mt-2 text-[#5e6a7d]">Monte um carrinho e finalize a primeira compra de teste.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-display text-xl font-black text-[#202838]">Pedido {order.code}</h3>
                  <p className="mt-1 text-sm text-[#66758a]">
                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(order.createdAt)}
                  </p>
                </div>
                <div className="text-sm font-bold text-[#5e6a7d] md:text-right">
                  <p>{orderStatusLabel(order.status)}</p>
                  <p>{paymentStatusLabel(order.paymentStatus)}</p>
                  <p className="mt-1 font-display text-2xl font-black text-[#063f8f]">{formatPrice(order.totalCents)}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm">
                    <span className="font-bold text-[#202838]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-[#66758a]">SKU {item.sku}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
