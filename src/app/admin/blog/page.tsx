import { AdminPostsManager } from "@/components/admin/admin-posts-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-black uppercase text-[#20a33a]">Blog</p>
        <h1 className="mt-2 font-display text-4xl font-black text-[#202838]">Gestao de posts</h1>
        <p className="mt-2 text-[#66758a]">Publique atualizacoes de produtos, novidades e comunicados comerciais.</p>
      </div>
      <AdminPostsManager posts={posts} />
    </div>
  );
}
