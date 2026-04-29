import { NextRequest, NextResponse } from "next/server";
import { createPasswordHash, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return NextResponse.json({ error: "Este e-mail ja possui cadastro." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await createPasswordHash(parsed.data.password),
      role: "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  });

  await setSessionCookie({ userId: user.id, role: user.role });

  return NextResponse.json({ user });
}
