"use client";

import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { slugify } from "@/lib/format";

type Category = { id: string; name: string; slug: string };
type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  priceCents: number;
  stock: number;
  shortDescription: string;
  description: string;
  specifications: string;
  featured: boolean;
  active: boolean;
  categoryId: string;
  images: { url: string; alt: string }[];
};

const emptyProduct = (categoryId = ""): AdminProduct => ({
  id: "",
  name: "",
  sku: "",
  slug: "",
  priceCents: 0,
  stock: 0,
  shortDescription: "",
  description: "",
  specifications: "{}",
  featured: false,
  active: true,
  categoryId,
  images: [],
});

export function AdminProductsManager({ products, categories }: { products: AdminProduct[]; categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminProduct>(emptyProduct(categories[0]?.id));
  const [price, setPrice] = useState("");
  const [imageLines, setImageLines] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const isEditing = Boolean(editing.id);

  function startEdit(product: AdminProduct) {
    setEditing(product);
    setPrice((product.priceCents / 100).toFixed(2).replace(".", ","));
    setImageLines(product.images.map((image) => image.url).join("\n"));
    setNotice("");
  }

  function resetForm() {
    setEditing(emptyProduct(categories[0]?.id));
    setPrice("");
    setImageLines("");
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.url) {
      setImageLines((current) => [current, data.url].filter(Boolean).join("\n"));
      setNotice("Imagem enviada e adicionada ao produto.");
    } else {
      setNotice(data?.error || "Falha no upload.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const body = {
      name,
      sku: String(form.get("sku") || ""),
      slug: String(form.get("slug") || slugify(name)),
      priceCents: Math.round(Number(price.replace(".", "").replace(",", ".")) * 100),
      stock: Number(form.get("stock") || 0),
      shortDescription: String(form.get("shortDescription") || ""),
      description: String(form.get("description") || ""),
      specifications: String(form.get("specifications") || "{}"),
      featured: form.get("featured") === "on",
      active: form.get("active") === "on",
      categoryId: String(form.get("categoryId") || ""),
      images: imageLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((url) => ({ url, alt: name })),
    };

    const response = await fetch(isEditing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setNotice(data?.error || "Nao foi possivel salvar.");
      return;
    }

    setNotice(isEditing ? "Produto atualizado." : "Produto criado.");
    resetForm();
    router.refresh();
  }

  async function remove(productId: string) {
    if (!window.confirm("Remover este produto?")) return;
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  const currentPriceLabel = useMemo(() => (editing.priceCents ? (editing.priceCents / 100).toFixed(2).replace(".", ",") : ""), [editing.priceCents]);

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
      <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl font-black text-[#202838]">Produtos cadastrados</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>SKU</th>
                <th>Estoque</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <p className="font-black text-[#202838]">{product.name}</p>
                    <p className="text-xs text-[#66758a]">{product.slug}</p>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.stock}</td>
                  <td>{product.active ? "Publicado" : "Inativo"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="rounded-lg border border-[#dbe4f0] p-2 text-[#063f8f]" aria-label="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => remove(product.id)} className="rounded-lg border border-[#dbe4f0] p-2 text-red-600" aria-label="Remover">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-[#202838]">{isEditing ? "Editar produto" : "Novo produto"}</h2>
          {isEditing && (
            <button onClick={resetForm} className="rounded-lg border border-[#dbe4f0] px-3 py-2 text-sm font-black">
              Limpar
            </button>
          )}
        </div>
        {notice && <div className="mt-4 rounded-lg bg-[#edf4fb] p-3 text-sm font-bold text-[#063f8f]">{notice}</div>}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black">Nome</span>
            <input name="name" required className="form-input" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value, slug: editing.slug || slugify(event.target.value) })} />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-black">SKU</span>
              <input name="sku" required className="form-input" value={editing.sku} onChange={(event) => setEditing({ ...editing, sku: event.target.value })} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-black">Slug</span>
              <input name="slug" required className="form-input" value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} />
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-black">Preco (R$)</span>
              <input name="price" required className="form-input" value={price || currentPriceLabel} onChange={(event) => setPrice(event.target.value)} placeholder="99,90" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-black">Estoque</span>
              <input name="stock" type="number" min={0} required className="form-input" value={editing.stock} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Categoria</span>
            <select name="categoryId" required className="form-input" value={editing.categoryId} onChange={(event) => setEditing({ ...editing, categoryId: event.target.value })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Descricao curta</span>
            <textarea name="shortDescription" required rows={2} className="form-input" value={editing.shortDescription} onChange={(event) => setEditing({ ...editing, shortDescription: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Descricao completa</span>
            <textarea name="description" required rows={4} className="form-input" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Especificacoes JSON</span>
            <textarea name="specifications" rows={4} className="form-input font-mono text-xs" value={editing.specifications} onChange={(event) => setEditing({ ...editing, specifications: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Imagens (uma URL por linha)</span>
            <textarea rows={4} className="form-input" value={imageLines} onChange={(event) => setImageLines(event.target.value)} placeholder="/products/figurinhas-copa-2026-panini-1.jpeg" />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#dbe4f0] px-3 py-2 text-sm font-black">
            <Upload size={17} />
            Enviar imagem
            <input type="file" accept="image/*" className="sr-only" onChange={uploadImage} />
          </label>
          <div className="flex gap-5 text-sm font-black">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={editing.active} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} />
              Publicado
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={editing.featured} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} />
              Destaque
            </label>
          </div>
          <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-5 text-sm font-black text-white">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {isEditing ? "Salvar alteracoes" : "Criar produto"}
          </button>
        </form>
      </section>
    </div>
  );
}
