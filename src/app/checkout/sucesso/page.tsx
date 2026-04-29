import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Settings } from "lucide-react";
import { formatPrice, orderStatusLabel, paymentStatusLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pedido recebido",
};

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = getParam(params, "order") || getParam(params, "external_reference");
  const setup = getParam(params, "setup");

  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
    : null;

  return (
    <section className="container-gfs py-14">
      <div className="mx-auto max-w-3xl rounded-lg border border-[#dbe4f0] bg-white p-7 text-center shadow-xl">
        {setup ? <Settings className="mx-auto text-[#f4b227]" size={44} /> : <CheckCircle2 className="mx-auto text-[#20a33a]" size={44} />}
        <h1 className="mt-4 font-display text-4xl font-black text-[#202838]">
          {setup ? "Pedido salvo. Falta configurar o Mercado Pago." : "Pedido recebido"}
        </h1>
        <p className="mt-3 text-[#5e6a7d]">
          {setup
            ? "A venda real fica ativa assim que MERCADO_PAGO_ACCESS_TOKEN for preenchido no .env."
            : "A confirmacao do pagamento sera refletida no pedido assim que o Mercado Pago notificar a loja."}
        </p>

        {order && (
          <div className="mt-6 rounded-lg bg-[#f7f9fc] p-5 text-left">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold text-[#66758a]">Pedido</p>
                <h2 className="font-display text-2xl font-black text-[#202838]">{order.code}</h2>
              </div>
              <div className="text-sm font-bold text-[#5e6a7d] md:text-right">
                <p>{orderStatusLabel(order.status)}</p>
                <p>{paymentStatusLabel(order.paymentStatus)}</p>
                <p className="mt-1 font-display text-2xl font-black text-[#063f8f]">{formatPrice(order.totalCents)}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 rounded-lg bg-white px-4 py-3 text-sm">
                  <span className="font-bold text-[#202838]">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-[#66758a]">SKU {item.sku}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/minha-conta" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#063f8f] px-6 text-sm font-black text-white">
            Ver meus pedidos
          </Link>
          <Link href="/produtos" className="inline-flex h-12 items-center justify-center rounded-lg border border-[#dbe4f0] px-6 text-sm font-black text-[#202838]">
            Voltar ao catalogo
          </Link>
        </div>
      </div>
    </section>
  );
}
