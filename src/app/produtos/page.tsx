import type { Metadata } from "next";
import Link from "next/link";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductCard } from "@/components/product/product-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Catalogo de produtos da GFS Variemix Brasil com busca, filtros e ordenacao.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = getParam(params, "q")?.trim();
  const category = getParam(params, "categoria");
  const sort = getParam(params, "ordenar") || "featured";

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const selectedCategory = category ? categories.find((item) => item.slug === category) : null;

  const orderBy =
    sort === "price-asc"
      ? [{ priceCents: "asc" as const }]
      : sort === "price-desc"
        ? [{ priceCents: "desc" as const }]
        : sort === "name"
          ? [{ name: "asc" as const }]
          : [{ featured: "desc" as const }, { createdAt: "desc" as const }];

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { sku: { contains: query } },
              { shortDescription: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy,
  });

  return (
    <div>
      <section className="hero-stage py-10">
        <div className="container-gfs">
          <p className="text-sm font-black uppercase text-[#20a33a]">Catalogo GFS</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-black text-[#202838]">Produtos para compra direta</h1>
              <p className="mt-3 max-w-2xl text-[#5e6a7d]">
                Filtre por categoria, procure por SKU e monte seu carrinho com os itens de exemplo.
              </p>
            </div>
            <Link
              href="/carrinho"
              className="button-shine inline-flex h-11 items-center justify-center rounded-lg bg-[#063f8f] px-5 text-sm font-black text-white"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      </section>

      <section className="container-gfs py-8">
        <ProductFilters categories={categories} />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#5e6a7d]">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
          {(query || selectedCategory) && (
            <Link href="/produtos" className="text-sm font-black text-[#063f8f]">
              Limpar filtros
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-[#b9c8db] bg-white p-10 text-center">
            <h2 className="font-display text-2xl font-black text-[#202838]">Nenhum produto encontrado</h2>
            <p className="mt-2 text-[#5e6a7d]">Tente buscar por outro termo ou limpar a categoria selecionada.</p>
          </div>
        )}
      </section>
    </div>
  );
}
