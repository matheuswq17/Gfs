import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/format";

export function hasMercadoPagoCredentials() {
  return Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN);
}

function getMercadoPagoClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) return null;

  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 7000 },
  });
}

export async function createMercadoPagoPreference(orderId: string) {
  const client = getMercadoPagoClient();
  if (!client) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return null;

  const baseUrl = getBaseUrl();
  const preference = new Preference(client);
  const response = await preference.create({
    body: {
      items: order.items.map((item) => ({
        id: item.sku,
        title: item.name,
        description: `SKU ${item.sku}`,
        picture_url: item.imageUrl ? `${baseUrl}${item.imageUrl}` : undefined,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.priceCents / 100,
      })),
      payer: {
        name: order.customerName,
        email: order.customerEmail,
      },
      external_reference: order.id,
      metadata: {
        order_id: order.id,
        order_code: order.code,
      },
      back_urls: {
        success: `${baseUrl}/checkout/sucesso?order=${order.id}`,
        pending: `${baseUrl}/checkout/sucesso?order=${order.id}&status=pending`,
        failure: `${baseUrl}/checkout/sucesso?order=${order.id}&status=failure`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/mercado-pago/webhook`,
      statement_descriptor: "GFS VARIEMIX",
      payment_methods: {
        installments: 12,
        default_installments: 1,
      },
    },
    requestOptions: {
      idempotencyKey: order.id,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      mercadoPagoPreferenceId: response.id,
      mercadoPagoInitPoint: response.init_point || response.sandbox_init_point,
    },
  });

  return {
    preferenceId: response.id,
    initPoint: response.init_point || response.sandbox_init_point,
  };
}

export async function syncMercadoPagoPayment(paymentId: string) {
  const client = getMercadoPagoClient();
  if (!client) return null;

  const payment = new Payment(client);
  const response = await payment.get({ id: paymentId });
  const orderId = response.external_reference;

  if (!orderId) return response;

  const nextPaymentStatus = response.status === "approved" ? "APPROVED" : response.status?.toUpperCase() || "PENDING";
  const nextOrderStatus =
    response.status === "approved" ? "PAID" : response.status === "rejected" ? "FAILED" : "PENDING";

  const current = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!current) return response;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        mercadoPagoPaymentId: String(response.id || paymentId),
        paymentStatus: nextPaymentStatus,
        status: nextOrderStatus,
      },
    });

    if (nextOrderStatus === "PAID" && current.status !== "PAID") {
      for (const item of current.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }
  });

  return response;
}
