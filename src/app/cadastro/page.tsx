import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Cadastro",
};

export default function RegisterPage() {
  return (
    <section className="container-gfs grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1fr_460px]">
      <div>
        <p className="text-sm font-black uppercase text-[#20a33a]">Cadastro comercial</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[#202838]">Crie uma conta para comprar com mais rapidez.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#5e6a7d]">
          O cadastro salva o acesso do comprador e permite consultar pedidos feitos na loja. A compra
          tambem pode ser finalizada com dados preenchidos no checkout.
        </p>
      </div>
      <div className="rounded-lg border border-[#dbe4f0] bg-white p-6 shadow-xl">
        <h2 className="font-display text-2xl font-black text-[#202838]">Criar cadastro</h2>
        <p className="mb-6 mt-2 text-sm text-[#66758a]">Senha com no minimo 8 caracteres.</p>
        <RegisterForm />
      </div>
    </section>
  );
}
