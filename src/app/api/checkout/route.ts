import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBaseUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { createStripeCheckoutSession, hasStripeCredentials } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";

function generateOrderCode() {
  return `GFS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const ids = [...new Set(parsed.data.items.map((item) => item.productId).filter(Boolean))];
  const skus = [...new Set(parsed.data.items.map((item) => item.sku).filter((sku): sku is string => Boolean(sku)))];
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ id: { in: ids } }, { sku: { in: skus } }],
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const productBySku = new Map(products.map((product) => [product.sku, product]));
  let totalCents = 0;

  for (const item of parsed.data.items) {
    const product = productById.get(item.productId) || (item.sku ? productBySku.get(item.sku) : null);
    if (!product) {
      return NextResponse.json({ error: "Um ou mais produtos nao estao disponiveis." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Estoque insuficiente para ${product.name}.` }, { status: 400 });
    }
    totalCents += product.priceCents * item.quantity;
  }

  const user = await getCurrentUser();
  const order = await prisma.order.create({
    data: {
      code: generateOrderCode(),
      userId: user?.id,
      customerName: parsed.data.buyer.name,
      customerEmail: parsed.data.buyer.email,
      customerPhone: parsed.data.buyer.phone,
      customerDocument: parsed.data.buyer.document,
      cep: parsed.data.buyer.cep,
      addressLine: parsed.data.buyer.addressLine,
      number: parsed.data.buyer.number,
      complement: parsed.data.buyer.complement,
      neighborhood: parsed.data.buyer.neighborhood,
      city: parsed.data.buyer.city,
      state: parsed.data.buyer.state.toUpperCase(),
      totalCents,
      paymentMethod: parsed.data.paymentMethod,
      items: {
        create: parsed.data.items.map((item) => {
          const product = productById.get(item.productId) || productBySku.get(item.sku || "");
          if (!product) {
            throw new Error("Produto indisponivel no checkout.");
          }

          return {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            priceCents: product.priceCents,
            quantity: item.quantity,
            imageUrl: product.images[0]?.url,
          };
        }),
      },
    },
  });

  if (!hasStripeCredentials()) {
    return NextResponse.json({
      orderId: order.id,
      orderCode: order.code,
      providerConfigured: false,
      redirectUrl: `${getBaseUrl()}/checkout/sucesso?order=${order.id}&setup=stripe`,
    });
  }

  try {
    const session = await createStripeCheckoutSession(order.id);
    if (!session?.url) {
      return NextResponse.json({ error: "Stripe nao retornou URL de pagamento." }, { status: 502 });
    }

    return NextResponse.json({
      orderId: order.id,
      orderCode: order.code,
      providerConfigured: true,
      redirectUrl: session.url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Pedido criado, mas houve falha ao criar a sessao de pagamento do Stripe." },
      { status: 502 },
    );
  }
}
