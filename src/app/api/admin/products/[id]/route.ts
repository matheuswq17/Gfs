import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";

type ProductRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: ProductRouteProps) {
  await requireAdmin();
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        sku: parsed.data.sku,
        slug: parsed.data.slug,
        priceCents: parsed.data.priceCents,
        stock: parsed.data.stock,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        specifications: parsed.data.specifications,
        featured: parsed.data.featured,
        active: parsed.data.active,
        categoryId: parsed.data.categoryId,
        images: {
          create: parsed.data.images.map((image, index) => ({
            url: image.url,
            alt: image.alt || parsed.data.name,
            sortOrder: index,
          })),
        },
      },
    });
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: ProductRouteProps) {
  await requireAdmin();
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
