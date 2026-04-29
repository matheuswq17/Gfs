import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description: "Atualizacoes comerciais e novidades de produtos da GFS Variemix Brasil.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <section className="container-gfs py-12">
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Blog</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Atualizacoes de produtos e operacao</h1>
        <p className="mt-3 max-w-2xl text-[#5e6a7d]">
          Comunicados simples para novidades de catalogo, entrada de itens, reposicao e orientacoes comerciais.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="motion-card feature-card rounded-lg border border-[#dbe4f0] bg-white shadow-sm">
            {post.coverImage && (
              <Image src={post.coverImage} alt={post.title} width={720} height={560} className="aspect-[1.35] rounded-t-lg object-cover" />
            )}
            <div className="p-5">
              <p className="text-xs font-black uppercase text-[#063f8f]">Atualizacao</p>
              <h2 className="mt-3 font-display text-xl font-black leading-7 text-[#202838]">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#5e6a7d]">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
