import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validators";

type PostRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: PostRouteProps) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const current = await prisma.blogPost.findUnique({ where: { id } });
  const publishedAt = parsed.data.published ? current?.publishedAt || new Date() : null;

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      publishedAt,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: PostRouteProps) {
  await requireAdmin();
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
