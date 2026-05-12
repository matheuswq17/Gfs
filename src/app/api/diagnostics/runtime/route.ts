import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

  return NextResponse.json({
    env: {
      databaseUrl: summarizeUrl("DATABASE_URL"),
      directUrl: summarizeUrl("DIRECT_URL"),
      authSecretPresent: Boolean(process.env.AUTH_SECRET),
      appUrlPresent: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      stripeSecretPresent: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhookSecretPresent: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      stripePublishableKeyPresent: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    database,
  });
}
