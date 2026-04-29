import { formatPrice, orderStatusLabel, paymentStatusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Pedidos</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Gestao de pedidos</h1>
        <p className="mt-2 text-[#66758a]">Acompanhe comprador, itens, status do pedido e status de pagamento.</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h2 className="font-display text-2xl font-black text-[#202838]">{order.code}</h2>
                <p className="mt-1 text-sm text-[#66758a]">
                  {order.customerName} - {order.customerEmail}
                </p>
                <p className="mt-1 text-sm text-[#66758a]">
                  {order.addressLine}, {order.number} - {order.city}/{order.state}
                </p>
              </div>
              <div className="grid gap-2 text-sm font-bold xl:text-right">
                <span>{orderStatusLabel(order.status)}</span>
                <span>{paymentStatusLabel(order.paymentStatus)}</span>
                <span>Metodo: {order.paymentMethod === "PIX" ? "Pix" : "Cartao"}</span>
                <span className="font-display text-2xl font-black text-[#063f8f]">{formatPrice(order.totalCents)}</span>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>SKU</th>
                    <th>Qtd.</th>
                    <th>Preco</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-black text-[#202838]">{item.name}</td>
                      <td>{item.sku}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.priceCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
        {orders.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#b9c8db] bg-white p-10 text-center text-[#66758a]">
            Nenhum pedido registrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
