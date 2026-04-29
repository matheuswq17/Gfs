import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  await requireAdmin();
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: {
        create: parsed.data.images.map((image, index) => ({
          url: image.url,
          alt: image.alt || parsed.data.name,
          sortOrder: index,
        })),
      },
    },
  });

  return NextResponse.json({ product });
}
