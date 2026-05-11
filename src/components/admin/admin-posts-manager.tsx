"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { slugify } from "@/lib/format";

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
};

const emptyPost: AdminPost = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  published: true,
};

export function AdminPostsManager({ posts }: { posts: AdminPost[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminPost>(emptyPost);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const isEditing = Boolean(editing.id);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice("");

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "");
    const body = {
      title,
      slug: String(form.get("slug") || slugify(title)),
      excerpt: String(form.get("excerpt") || ""),
      content: String(form.get("content") || ""),
      coverImage: String(form.get("coverImage") || ""),
      published: form.get("published") === "on",
    };

    const response = await fetch(isEditing ? `/api/admin/posts/${editing.id}` : "/api/admin/posts", {
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

    setNotice(isEditing ? "Post atualizado." : "Post criado.");
    setEditing(emptyPost);
    router.refresh();
  }

  async function remove(postId: string) {
    if (!window.confirm("Remover este post?")) return;
    const response = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
      <section className="rounded-lg border border-[#dbe4f0] bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl font-black text-[#202838]">Posts cadastrados</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <p className="font-black text-[#202838]">{post.title}</p>
                    <p className="text-xs text-[#66758a]">{post.slug}</p>
                  </td>
                  <td>{post.published ? "Publicado" : "Rascunho"}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(post)} className="rounded-lg border border-[#dbe4f0] p-2 text-[#063f8f]" aria-label="Editar post">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => remove(post.id)} className="rounded-lg border border-[#dbe4f0] p-2 text-red-600" aria-label="Remover post">
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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-black text-[#202838]">{isEditing ? "Editar post" : "Novo post"}</h2>
          {isEditing && (
            <button onClick={() => setEditing(emptyPost)} className="rounded-lg border border-[#dbe4f0] px-3 py-2 text-sm font-black">
              Limpar
            </button>
          )}
        </div>
        {notice && <div className="mt-4 rounded-lg bg-[#edf4fb] p-3 text-sm font-bold text-[#063f8f]">{notice}</div>}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black">Titulo</span>
            <input name="title" required className="form-input" value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value, slug: editing.slug || slugify(event.target.value) })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Slug</span>
            <input name="slug" required className="form-input" value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Resumo</span>
            <textarea name="excerpt" rows={3} required className="form-input" value={editing.excerpt} onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Conteudo</span>
            <textarea name="content" rows={7} required className="form-input" value={editing.content} onChange={(event) => setEditing({ ...editing, content: event.target.value })} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black">Imagem de capa</span>
            <input name="coverImage" className="form-input" value={editing.coverImage || ""} onChange={(event) => setEditing({ ...editing, coverImage: event.target.value })} placeholder="/products/figurinhas-copa-2026-panini-1.jpeg" />
          </label>
          <label className="flex items-center gap-2 text-sm font-black">
            <input type="checkbox" name="published" checked={editing.published} onChange={(event) => setEditing({ ...editing, published: event.target.checked })} />
            Publicado
          </label>
          <button disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-5 text-sm font-black text-white">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            {isEditing ? "Salvar post" : "Criar post"}
          </button>
        </form>
      </section>
    </div>
  );
}
