import { AdminProductsManager } from "@/components/admin/admin-products-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Catalogo</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Gestao de produtos</h1>
        <p className="mt-2 text-[#66758a]">Crie, edite, publique, despublique e substitua imagens dos SKUs.</p>
      </div>
      <AdminProductsManager
        categories={categories}
        products={products.map((product) => ({
          ...product,
          images: product.images.map((image) => ({ url: image.url, alt: image.alt })),
        }))}
      />
    </div>
  );
}
