"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("categoria") || "");
  const [sort, setSort] = useState(searchParams.get("ordenar") || "featured");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("categoria", category);
    if (sort) params.set("ordenar", sort);
    router.push(`/produtos?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="motion-card rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 font-display text-sm font-black uppercase text-[#202838]">
        <SlidersHorizontal size={18} className="text-[#063f8f]" />
        Filtros do catalogo
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
        <label className="relative">
          <span className="sr-only">Buscar</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66758a]" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome, SKU ou descricao"
            className="form-input pl-10"
          />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="form-input">
          <option value="">Todas as categorias</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="form-input">
          <option value="featured">Destaques primeiro</option>
          <option value="price-asc">Menor preco</option>
          <option value="price-desc">Maior preco</option>
          <option value="name">Nome A-Z</option>
        </select>
        <button className="button-shine interactive-button inline-flex h-12 items-center justify-center rounded-lg bg-[#f4b227] px-5 text-sm font-black text-[#202838] transition hover:bg-[#e8a51b]">
          Aplicar
        </button>
      </div>
    </form>
  );
}
