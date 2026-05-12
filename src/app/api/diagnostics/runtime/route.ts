import https from "https";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function testHttpsReachability(hostname: string): Promise<{ ok: boolean; statusCode?: number; error?: string }> {
  return new Promise((resolve) => {
    const req = https.request({ hostname, path: "/", method: "HEAD", timeout: 5000 }, (res) => {
      resolve({ ok: true, statusCode: res.statusCode });
    });
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, error: "timeout" }); });
    req.on("error", (e: NodeJS.ErrnoException) => resolve({ ok: false, error: e.code ?? e.message }));
    req.end();
  });
}

function summarizeUrl(name: "DATABASE_URL" | "DIRECT_URL") {
  const rawValue = process.env[name];
  const value = rawValue?.trim() || "";
  const withoutAssignment = value.startsWith(`${name}=`) ? value.slice(name.length + 1).trim() : value;
  const normalized =
    (withoutAssignment.startsWith('"') && withoutAssignment.endsWith('"')) ||
    (withoutAssignment.startsWith("'") && withoutAssignment.endsWith("'"))
      ? withoutAssignment.slice(1, -1)
      : withoutAssignment;

  return {
    present: Boolean(rawValue),
    hasAssignmentPrefix: value.startsWith(`${name}=`),
    hasWrappedQuotes:
      (withoutAssignment.startsWith('"') && withoutAssignment.endsWith('"')) ||
      (withoutAssignment.startsWith("'") && withoutAssignment.endsWith("'")),
    startsWithPostgres: normalized.startsWith("postgresql://") || normalized.startsWith("postgres://"),
    usesSupabasePooler: normalized.includes(".pooler.supabase.com"),
    hasPgbouncer: normalized.includes("pgbouncer=true"),
    port: normalized.match(/:(\d+)\/postgres/)?.[1] || null,
  };
}

export async function GET(request: NextRequest) {
  if (request.headers.get("x-gfs-diagnostics") !== "status") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let database: { ok: boolean; productCount?: number; errorName?: string } = { ok: false };

  try {
    database = {
      ok: true,
      productCount: await prisma.product.count(),
    };
  } catch (error) {
    database = {
      ok: false,
      errorName: error instanceof Error ? error.name : "UnknownError",
    };
  }

  const rawKey = process.env.STRIPE_SECRET_KEY ?? "";
  const keyPrefix = rawKey.slice(0, 8);
  const keyLength = rawKey.length;

  let stripeNetworkReach: { ok: boolean; statusCode?: number; error?: string } = { ok: false };
  let stripeApiTest: { ok: boolean; errorType?: string; statusCode?: number } = { ok: false };

  try {
    stripeNetworkReach = await testHttpsReachability("api.stripe.com");
  } catch {}

  if (rawKey) {
    const stripe = new Stripe(rawKey, { httpClient: Stripe.createNodeHttpClient() });
    try {
      await (stripe as Stripe).checkout.sessions.list({ limit: 1 });
      stripeApiTest = { ok: true };
    } catch (e: unknown) {
      const err = e as { type?: string; statusCode?: number };
      stripeApiTest = { ok: false, errorType: err.type, statusCode: err.statusCode };
    }
  }

  return NextResponse.json({
    env: {
      databaseUrl: summarizeUrl("DATABASE_URL"),
      directUrl: summarizeUrl("DIRECT_URL"),
      authSecretPresent: Boolean(process.env.AUTH_SECRET),
      appUrlPresent: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      stripeKeyPrefix: keyPrefix,
      stripeKeyLength: keyLength,
      stripeSecretPresent: Boolean(rawKey),
      stripeWebhookSecretPresent: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      stripePublishableKeyPresent: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    database,
    stripeNetworkReach,
    stripeApiTest,
  });
}
