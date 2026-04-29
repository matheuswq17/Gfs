import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      publishedAt: parsed.data.published ? new Date() : null,
    },
  });

  return NextResponse.json({ post });
}
