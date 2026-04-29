"use client";

import { CreditCard, Loader2, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export function CheckoutForm() {
  const { items, subtotalCents, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CARD">("PIX");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buyer, setBuyer] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (data?.user) setBuyer({ name: data.user.name, email: data.user.email });
      })
      .catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ productId: item.id, sku: item.sku, quantity: item.quantity })),
        paymentMethod,
        buyer: {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          document: String(form.get("document") || ""),
          cep: String(form.get("cep") || ""),
          addressLine: String(form.get("addressLine") || ""),
          number: String(form.get("number") || ""),
          complement: String(form.get("complement") || ""),
          neighborhood: String(form.get("neighborhood") || ""),
          city: String(form.get("city") || ""),
          state: String(form.get("state") || ""),
        },
      }),
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Nao foi possivel iniciar o pagamento.");
      return;
    }

    clearCart();
    window.location.href = data.redirectUrl;
  }

  if (items.length === 0) {
    return (
      <section className="container-gfs py-14">
        <div className="rounded-lg border border-dashed border-[#b9c8db] bg-white p-12 text-center">
          <h1 className="font-display text-3xl font-black text-[#202838]">Carrinho vazio</h1>
          <p className="mt-2 text-[#5e6a7d]">Adicione produtos antes de ir para o checkout.</p>
          <Link href="/produtos" className="mt-6 inline-flex h-12 items-center rounded-lg bg-[#063f8f] px-6 text-sm font-black text-white">
            Ver produtos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-gfs py-12">
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Checkout</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Dados e pagamento</h1>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

          <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black text-[#202838]">Comprador</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-black text-[#202838]">Nome</span>
                <input name="name" required className="form-input" defaultValue={buyer.name} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-black text-[#202838]">E-mail</span>
                <input name="email" type="email" required className="form-input" defaultValue={buyer.email} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-black text-[#202838]">Telefone</span>
                <input name="phone" required className="form-input" placeholder="(11) 99999-9999" />
              </label>
              <label>
                <span className="mb-2 block text-sm font-black text-[#202838]">CPF/CNPJ</span>
                <input name="document" className="form-input" placeholder="Opcional" />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black text-[#202838]">Endereco de entrega</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-6">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[#202838]">CEP</span>
                <input name="cep" required className="form-input" />
              </label>
              <label className="md:col-span-4">
                <span className="mb-2 block text-sm font-black text-[#202838]">Endereco</span>
                <input name="addressLine" required className="form-input" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[#202838]">Numero</span>
                <input name="number" required className="form-input" />
              </label>
              <label className="md:col-span-4">
                <span className="mb-2 block text-sm font-black text-[#202838]">Complemento</span>
                <input name="complement" className="form-input" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[#202838]">Bairro</span>
                <input name="neighborhood" required className="form-input" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[#202838]">Cidade</span>
                <input name="city" required className="form-input" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[#202838]">Estado</span>
                <input name="state" required className="form-input" maxLength={2} placeholder="SP" />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-black text-[#202838]">Pagamento</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`rounded-lg border p-4 text-left transition ${
                  paymentMethod === "PIX" ? "border-[#20a33a] bg-[#f1fbf3]" : "border-[#dbe4f0] bg-white"
                }`}
              >
                <QrCode className="text-[#20a33a]" size={24} />
                <span className="mt-3 block font-display text-lg font-black text-[#202838]">Pix</span>
                <span className="mt-1 block text-sm text-[#66758a]">Gerado pelo checkout Mercado Pago.</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`rounded-lg border p-4 text-left transition ${
                  paymentMethod === "CARD" ? "border-[#063f8f] bg-[#edf4fb]" : "border-[#dbe4f0] bg-white"
                }`}
              >
                <CreditCard className="text-[#063f8f]" size={24} />
                <span className="mt-3 block font-display text-lg font-black text-[#202838]">Cartao</span>
                <span className="mt-1 block text-sm text-[#66758a]">Credito pelo ambiente seguro do Mercado Pago.</span>
              </button>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-black text-[#202838]">Pedido</h2>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-[#edf2f8] pb-3">
                <Image src={item.image} alt={item.name} width={74} height={58} className="h-[58px] w-[74px] rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-[#202838]">{item.name}</p>
                  <p className="mt-1 text-xs font-bold text-[#66758a]">
                    {item.quantity}x {formatPrice(item.priceCents)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-black text-[#202838]">Total dos itens</span>
            <span className="font-display text-2xl font-black text-[#063f8f]">{formatPrice(subtotalCents)}</span>
          </div>
          <button
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#20a33a] px-5 text-sm font-black text-white transition hover:bg-[#188a30] disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Ir para pagamento
          </button>
          <p className="mt-3 text-xs leading-5 text-[#66758a]">
            O pedido e salvo antes do redirecionamento. O webhook atualiza o status quando o Mercado
            Pago confirma a transacao.
          </p>
        </aside>
      </form>
    </section>
  );
}
