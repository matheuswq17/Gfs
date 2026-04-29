import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!post) return { title: "Post" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="container-gfs max-w-4xl py-12">
      <Link href="/blog" className="text-sm font-black text-[#063f8f]">
        Voltar ao blog
      </Link>
      <p className="mt-8 text-sm font-black uppercase text-[#20a33a]">Atualizacao comercial</p>
      <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[#202838]">{post.title}</h1>
      <p className="mt-5 text-xl leading-8 text-[#5e6a7d]">{post.excerpt}</p>
      {post.coverImage && (
        <Image src={post.coverImage} alt={post.title} width={960} height={640} className="mt-8 aspect-[1.7] rounded-lg border border-[#dbe4f0] object-cover" />
      )}
      <div className="mt-8 rounded-lg border border-[#dbe4f0] bg-white p-7 shadow-sm">
        <p className="whitespace-pre-line text-lg leading-9 text-[#3f4f64]">{post.content}</p>
      </div>
    </article>
  );
}
