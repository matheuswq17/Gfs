import Stripe from "stripe";
import { getBaseUrl } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const defaultPriceBySku: Record<string, string> = {
  "GFS-FIG-001": "price_1TW4Ji8mq64vbcgYd1m0tmJk",
  "GFS-VOL-002": "price_1TW4Jj8mq64vbcgY67ZZh7Xa",
  "GFS-ACE-003": "price_1TW4Jg8mq64vbcgYxgm1Qjmi",
  "GFS-BEB-004": "price_1TW4Jh8mq64vbcgYekTz4O2v",
  "GFS-VOL-005": "price_1TW4Jj8mq64vbcgYuuOhfi2t",
};

function getStripePriceMap() {
  if (!process.env.STRIPE_PRICE_MAP) return defaultPriceBySku;

  try {
    return { ...defaultPriceBySku, ...JSON.parse(process.env.STRIPE_PRICE_MAP) } as Record<string, string>;
  } catch {
    return defaultPriceBySku;
  }
}

export function hasStripeCredentials() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  return new Stripe(secretKey, {
    httpClient: Stripe.createNodeHttpClient(),
  });
}

function normalizePaymentIntentId(paymentIntent: string | Stripe.PaymentIntent | null) {
  if (!paymentIntent) return undefined;
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

function paymentMethodsFor(method: string) {
  return method === "PIX" ? (["pix"] as ["pix"]) : (["card"] as ["card"]);
}

export function getStripeErrorDetails(error: unknown) {
  const stripeError = error as {
    type?: string;
    code?: string;
    message?: string;
    param?: string;
    requestId?: string;
    statusCode?: number;
    raw?: {
      type?: string;
      code?: string;
      message?: string;
      param?: string;
      requestId?: string;
      statusCode?: number;
    };
  };

  return {
    type: stripeError.type || stripeError.raw?.type,
    code: stripeError.code || stripeError.raw?.code,
    message: stripeError.message || stripeError.raw?.message,
    param: stripeError.param || stripeError.raw?.param,
    requestId: stripeError.requestId || stripeError.raw?.requestId,
    statusCode: stripeError.statusCode || stripeError.raw?.statusCode,
  };
}

export async function createStripeCheckoutSession(orderId: string, origin?: string) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) return null;

  const baseUrl = getBaseUrl(origin);
  const priceBySku = getStripePriceMap();

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      locale: "pt-BR",
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      payment_method_types: paymentMethodsFor(order.paymentMethod),
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      line_items: order.items.map((item) => {
        const price = priceBySku[item.sku];
        if (price) {
          return {
            price,
            quantity: item.quantity,
          };
        }

        return {
          price_data: {
            currency: "brl",
            unit_amount: item.priceCents,
            product_data: {
              name: item.name,
              description: `SKU ${item.sku}`,
              images: item.imageUrl ? [`${baseUrl}${item.imageUrl}`] : undefined,
            },
          },
          quantity: item.quantity,
        };
      }),
      metadata: {
        order_id: order.id,
        order_code: order.code,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          order_code: order.code,
        },
      },
      success_url: `${baseUrl}/checkout/sucesso?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?cancelled=1&order=${order.id}`,
    },
    { idempotencyKey: order.id },
  );

  await prisma.order.update({
    where: { id: order.id },
    data: {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: normalizePaymentIntentId(session.payment_intent),
    },
  });

  return session;
}

async function updatePaidOrder(orderId: string, stripePaymentIntentId?: string) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!current) return null;

    const markedPaid = await tx.order.updateMany({
      where: {
        id: orderId,
        status: { not: "PAID" },
      },
      data: {
        status: "PAID",
        paymentStatus: "APPROVED",
        stripePaymentIntentId,
      },
    });

    if (markedPaid.count > 0) {
      for (const item of current.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    return tx.order.findUnique({ where: { id: orderId } });
  });
}

async function updateFailedOrder(orderId: string, stripePaymentIntentId?: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: "FAILED",
      paymentStatus: "REJECTED",
      stripePaymentIntentId,
    },
  });
}

export async function syncStripeCheckoutSession(sessionId: string) {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.order_id || session.client_reference_id;
  if (!orderId) return { session, orderId: null };

  const stripePaymentIntentId = normalizePaymentIntentId(session.payment_intent);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId,
      paymentStatus: session.payment_status === "paid" ? "APPROVED" : "PENDING",
    },
  });

  if (session.payment_status === "paid") {
    await updatePaidOrder(orderId, stripePaymentIntentId);
  }

  return { session, orderId };
}

export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || !signature) {
    throw new Error("Stripe webhook nao configurado.");
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id || session.client_reference_id;
    if (!orderId) return event;

    const stripePaymentIntentId = normalizePaymentIntentId(session.payment_intent);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId,
      },
    });

    if (event.type === "checkout.session.async_payment_failed") {
      await updateFailedOrder(orderId, stripePaymentIntentId);
      return event;
    }

    if (session.payment_status === "paid" || event.type === "checkout.session.async_payment_succeeded") {
      await updatePaidOrder(orderId, stripePaymentIntentId);
      return event;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.order_id;
    if (!orderId) return event;

    if (event.type === "payment_intent.succeeded") {
      await updatePaidOrder(orderId, intent.id);
    } else {
      await updateFailedOrder(orderId, intent.id);
    }
  }

  return event;
}
