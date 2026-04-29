"use client";

import { LogOut, Search, ShieldCheck, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useCart } from "@/components/cart/cart-provider";

type HeaderUser = {
  name: string;
  email: string;
  role: string;
} | null;

export function Header() {
  const router = useRouter();
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<HeaderUser>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/produtos?q=${encodeURIComponent(value)}` : "/produtos");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dbe4f0] bg-white/95 backdrop-blur">
      <div className="commerce-strip border-b border-[#dbe4f0] bg-[#063f8f] text-white">
        <div className="container-gfs flex h-9 items-center justify-between text-xs font-semibold">
          <span>Distribuidora multimarcas com checkout por Pix e cartao</span>
          <span className="hidden md:inline">Atendimento comercial: segunda a sexta, 8h as 18h</span>
        </div>
      </div>

      <div className="container-gfs flex min-h-[92px] items-center gap-5 py-3">
        <BrandLogo priority variant="compact" />

        <form onSubmit={onSearch} className="hidden flex-1 items-center md:flex">
          <label className="sr-only" htmlFor="global-search">
            Buscar produto
          </label>
          <div className="flex w-full overflow-hidden rounded-lg border border-[#ccd8e6] bg-[#f7f9fc] shadow-sm">
            <input
              id="global-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por produto, SKU ou categoria"
              className="h-12 flex-1 bg-transparent px-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-12 w-14 items-center justify-center bg-[#f4b227] text-[#202838] transition hover:bg-[#e8a51b]"
              aria-label="Buscar"
              title="Buscar"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-1 text-sm font-bold text-[#202838] lg:flex">
          <Link className="rounded-lg px-3 py-2 hover:bg-[#edf4fb]" href="/produtos">
            Catalogo
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-[#edf4fb]" href="/blog">
            Blog
          </Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-[#edf4fb]" href="/contato">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden h-11 items-center justify-center rounded-lg border border-[#dbe4f0] px-3 text-[#063f8f] transition hover:bg-[#edf4fb] md:inline-flex"
              title="Painel admin"
              aria-label="Painel admin"
            >
              <ShieldCheck size={19} />
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="hidden h-11 items-center justify-center rounded-lg border border-[#dbe4f0] px-3 text-[#202838] transition hover:bg-[#edf4fb] md:inline-flex"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden h-11 items-center justify-center rounded-lg border border-[#dbe4f0] px-3 text-[#202838] transition hover:bg-[#edf4fb] md:inline-flex"
              title="Entrar"
              aria-label="Entrar"
            >
              <UserRound size={19} />
            </Link>
          )}

          <Link
            href="/minha-conta"
            className="hidden rounded-lg px-2 py-2 text-sm font-bold text-[#202838] hover:bg-[#edf4fb] xl:inline-flex"
          >
            {user ? "Minha conta" : "Entrar"}
          </Link>

          <Link
            href="/carrinho"
            className="button-shine relative inline-flex h-11 items-center justify-center rounded-lg bg-[#063f8f] px-3 text-white transition hover:bg-[#073271]"
            title="Carrinho"
            aria-label="Carrinho"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f4b227] px-1 text-xs font-black text-[#202838]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="container-gfs pb-3 md:hidden">
        <form onSubmit={onSearch} className="flex overflow-hidden rounded-lg border border-[#ccd8e6] bg-[#f7f9fc]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar produto ou SKU"
            className="h-11 flex-1 bg-transparent px-3 text-sm outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-11 w-12 items-center justify-center bg-[#f4b227] text-[#202838]"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
        </form>
        <nav className="mt-2 flex gap-2 text-sm font-bold">
          <Link href="/produtos" className="rounded-lg bg-white px-3 py-2">
            Catalogo
          </Link>
          <Link href="/blog" className="rounded-lg bg-white px-3 py-2">
            Blog
          </Link>
          <Link href="/contato" className="rounded-lg bg-white px-3 py-2">
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}
