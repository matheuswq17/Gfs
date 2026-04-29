import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <section className="container-gfs grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1fr_440px]">
      <div>
        <p className="text-sm font-black uppercase text-[#20a33a]">Acesso do cliente</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[#202838]">Entre para acompanhar seus pedidos.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#5e6a7d]">
          O login libera o historico de compras e tambem protege o painel administrativo quando o
          usuario possui papel de admin.
        </p>
        <div className="mt-8 rounded-lg border border-[#dbe4f0] bg-white p-5 text-sm leading-7 text-[#5e6a7d]">
          <p className="font-black text-[#202838]">Credenciais de seed</p>
          <p>Admin: admin@gfsvariemix.com.br / Admin@12345</p>
          <p>Cliente: cliente@gfsvariemix.com.br / Cliente@12345</p>
        </div>
      </div>
      <div className="rounded-lg border border-[#dbe4f0] bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl font-black text-[#202838]">Login</h2>
        <p className="mb-6 mt-2 text-sm text-[#66758a]">Use e-mail e senha cadastrados.</p>
        <Suspense fallback={<div className="h-48 rounded-lg bg-[#f7f9fc]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
