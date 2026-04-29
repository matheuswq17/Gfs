import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice, parseSpecs } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true },
  });

  if (!product) return { title: "Produto" };

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  const specs = parseSpecs(product.specifications);
  const mainImage = product.images[0]?.url || "/products/gfs-produto-01.svg";
  const related = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
    take: 4,
  });

  return (
    <div>
      <section className="bg-white py-8">
        <div className="container-gfs text-sm font-bold text-[#66758a]">
          <Link href="/produtos" className="text-[#063f8f]">
            Catalogo
          </Link>{" "}
          / {product.category.name} / {product.name}
        </div>
      </section>

      <section className="container-gfs grid gap-9 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="motion-card rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm">
            <Image
              src={mainImage}
              alt={product.images[0]?.alt || product.name}
              width={720}
              height={560}
              priority
              className="aspect-[1.18] w-full rounded-lg object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.map((image) => (
              <div key={image.id} className="rounded-lg border border-[#dbe4f0] bg-white p-1">
                <Image src={image.url} alt={image.alt} width={180} height={140} className="aspect-[1.2] rounded-md object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="rounded-md bg-[#edf4fb] px-3 py-2 text-xs font-black uppercase text-[#063f8f]">
            {product.category.name}
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-tight text-[#202838]">{product.name}</h1>
          <p className="mt-3 text-sm font-black uppercase text-[#66758a]">SKU {product.sku}</p>
          <p className="mt-5 text-lg leading-8 text-[#4f5f74]">{product.shortDescription}</p>
          <div className="mt-6 flex items-end justify-between gap-5 rounded-lg border border-[#dbe4f0] bg-[#f7f9fc] p-5">
            <div>
              <p className="text-xs font-black uppercase text-[#66758a]">Preco unitario</p>
              <p className="mt-1 font-display text-4xl font-black text-[#063f8f]">{formatPrice(product.priceCents)}</p>
            </div>
            <p className="text-sm font-black text-[#20a33a]">Estoque: {product.stock}</p>
          </div>
          <div className="mt-5">
            <ProductPurchase
              product={{
                id: product.id,
                name: product.name,
                sku: product.sku,
                slug: product.slug,
                priceCents: product.priceCents,
                image: mainImage,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </section>

      <section className="container-gfs grid gap-6 py-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="motion-card rounded-lg border border-[#dbe4f0] bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-black text-[#202838]">Descricao completa</h2>
          <p className="mt-4 leading-8 text-[#4f5f74]">{product.description}</p>
        </div>
        <div className="motion-card rounded-lg border border-[#dbe4f0] bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-black text-[#202838]">Informacoes tecnicas</h2>
          <div className="mt-4 divide-y divide-[#edf2f8]">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 py-3 text-sm">
                <span className="font-black capitalize text-[#202838]">{key}</span>
                <span className="text-right text-[#5e6a7d]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-gfs py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-[#20a33a]">Relacionados</p>
              <h2 className="mt-2 font-display text-3xl font-black text-[#202838]">Na mesma categoria</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
