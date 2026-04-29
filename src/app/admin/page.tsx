import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [products, orders, posts, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.blogPost.count(),
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: "PAID" } }),
  ]);

  const latestOrders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-[#20a33a]">Operacao</p>
          <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Painel GFS Variemix Brasil</h1>
          <p className="mt-2 text-[#66758a]">Gestao real de catalogo, pedidos e blog.</p>
        </div>
        <Link href="/admin/produtos" className="rounded-lg bg-[#063f8f] px-5 py-3 text-sm font-black text-white">
          Gerenciar produtos
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Produtos", products],
          ["Pedidos", orders],
          ["Posts", posts],
          ["Receita aprovada", formatPrice(revenue._sum.totalCents || 0)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-[#66758a]">{label}</p>
            <p className="mt-2 font-display text-3xl font-black text-[#063f8f]">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl font-black text-[#202838]">Pedidos recentes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-black text-[#202838]">{order.code}</td>
                  <td>{order.customerName}</td>
                  <td>{order.status} / {order.paymentStatus}</td>
                  <td className="font-black text-[#063f8f]">{formatPrice(order.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {latestOrders.length === 0 && <p className="py-8 text-center text-sm text-[#66758a]">Nenhum pedido ainda.</p>}
        </div>
      </section>
    </div>
  );
}
