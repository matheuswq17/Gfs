import { NextRequest, NextResponse } from "next/server";
import { syncMercadoPagoPayment } from "@/lib/mercadopago";

function extractPaymentId(payload: unknown, request: NextRequest) {
  const url = request.nextUrl;
  const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
  if (queryId) return queryId;

  if (payload && typeof payload === "object") {
    const body = payload as { data?: { id?: string | number }; id?: string | number; type?: string; action?: string };
    if (body.data?.id) return String(body.data.id);
    if (body.id && (body.type === "payment" || body.action?.includes("payment"))) return String(body.id);
  }

  return null;
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const paymentId = extractPaymentId(payload, request);

  if (!paymentId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await syncMercadoPagoPayment(paymentId);
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const paymentId = extractPaymentId(null, request);
  if (paymentId) {
    await syncMercadoPagoPayment(paymentId);
  }
  return NextResponse.json({ ok: true });
}
