import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CreditCard,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, latestProducts, posts] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 4,
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const heroProduct = featuredProducts[0] || latestProducts[0];

  return (
    <div>
      <section className="hero-stage">
        <div className="container-gfs grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 fade-up">
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#dbe4f0] bg-[#f7f9fc] px-3 py-2 text-xs font-black uppercase text-[#063f8f]">
              <BadgeCheck size={16} />
              Compra organizada para variedade real
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-black leading-[1.03] text-[#202838] md:text-6xl">
              GFS Variemix Brasil
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-[#4f5f74]">
              Um e-commerce de distribuicao multimarcas com catalogo claro, SKU visivel, checkout
              por Pix e cartao e gestao pronta para operar produtos de alto giro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/produtos"
                className="button-shine inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-6 text-sm font-black text-white transition hover:bg-[#073271]"
              >
                Explorar catalogo <ArrowRight size={18} />
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex h-13 items-center justify-center rounded-lg border border-[#ccd8e6] bg-white px-6 text-sm font-black text-[#202838] transition hover:bg-[#edf4fb]"
              >
                Criar conta de compra
              </Link>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {[
                ["10", "SKUs iniciais prontos"],
                ["Pix", "Checkout Mercado Pago"],
                ["Admin", "Gestao de produtos"],
              ].map(([value, label]) => (
                <div key={value} className="metric-card rounded-lg border border-[#dbe4f0] bg-white/78 p-4 shadow-sm backdrop-blur">
                  <p className="font-display text-2xl font-black text-[#063f8f]">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-[#5e6a7d]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-sweep soft-float relative z-10 rounded-lg border border-[#dbe4f0] bg-[#f7f9fc] p-5 shadow-xl">
            <div className="logo-showcase pulse-halo flex justify-center rounded-lg bg-white p-4 shadow-sm">
              <BrandLogo variant="hero" priority />
            </div>
            {heroProduct && (
              <div className="relative z-10 mt-5 grid gap-4 rounded-lg bg-[#202838] p-4 text-white shadow-lg md:grid-cols-[180px_1fr]">
                <Image
                  src={heroProduct.images[0]?.url || "/products/gfs-produto-01.svg"}
                  alt={heroProduct.name}
                  width={720}
                  height={560}
                  className="aspect-[1.15] rounded-lg object-cover"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-black uppercase text-[#f4b227]">Produto em destaque</p>
                  <h2 className="mt-2 font-display text-2xl font-black">{heroProduct.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/72">{heroProduct.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-[#f4b227]">
                      {formatPrice(heroProduct.priceCents)}
                    </span>
                    <Link href={`/produtos/${heroProduct.slug}`} className="text-sm font-black text-white underline">
                      Ver item
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-gfs py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [PackageSearch, "Catalogo com SKU", "Busca por nome, categoria e codigo interno."],
            [CreditCard, "Pix e cartao", "Pagamento via Mercado Pago, pronto para sandbox e producao."],
            [ShieldCheck, "Conta e pedidos", "Login, cadastro e historico basico do comprador."],
            [Truck, "Operacao comercial", "Pedidos persistidos para acompanhamento administrativo."],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="motion-card feature-card rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
              <Icon className="text-[#20a33a]" size={24} />
              <h3 className="mt-4 font-display text-lg font-black text-[#202838]">{String(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5e6a7d]">{String(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-gfs py-10">
        <div className="fade-up mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-[#20a33a]">
              <Sparkles size={17} /> Vitrine principal
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-[#202838]">Produtos em destaque</h2>
          </div>
          <Link href="/produtos" className="inline-flex items-center gap-2 text-sm font-black text-[#063f8f]">
            Ver catalogo completo <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="commerce-strip mt-10 bg-[#063f8f] py-14 text-white">
        <div className="container-gfs grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase text-[#f4b227]">Novidades de estoque</p>
            <h2 className="mt-3 font-display text-3xl font-black">Entradas recentes no catalogo</h2>
            <p className="mt-4 max-w-lg leading-7 text-white/75">
              A loja esta pronta para receber os 10 produtos reais da GFS. Estes itens de exemplo
              mostram como a vitrine se comporta com imagens, preco, estoque e categoria.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latestProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.slug}`}
                className="motion-card rounded-lg border border-white/15 bg-white/8 p-4 transition hover:bg-white/12"
              >
                <Image
                  src={product.images[0]?.url || "/products/gfs-produto-01.svg"}
                  alt={product.name}
                  width={720}
                  height={560}
                  className="aspect-[1.2] rounded-lg object-cover"
                />
                <h3 className="mt-3 font-display text-lg font-black">{product.name}</h3>
                <p className="mt-1 text-sm text-white/70">SKU {product.sku}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-gfs py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase text-[#20a33a]">
              <Boxes size={17} /> Atualizacoes comerciais
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-[#202838]">Blog da loja</h2>
          </div>
          <Link href="/blog" className="hidden text-sm font-black text-[#063f8f] md:inline">
            Ver posts
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="motion-card feature-card rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm hover:border-[#b9c8db]"
            >
              <p className="text-xs font-black uppercase text-[#063f8f]">Atualizacao</p>
              <h3 className="mt-3 font-display text-xl font-black leading-7 text-[#202838]">{post.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#5e6a7d]">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
