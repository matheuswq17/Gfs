import type { Metadata } from "next";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contato",
};

export default function ContactPage() {
  return (
    <section className="container-gfs py-12">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-black uppercase text-[#20a33a]">Contato</p>
          <h1 className="mt-3 font-display text-5xl font-black leading-tight text-[#202838]">Fale com a GFS Variemix Brasil.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5e6a7d]">
            Use o formulario para duvidas comerciais, atualizacao de dados, informacoes de produtos
            ou apoio para substituir os SKUs de exemplo pelos produtos reais.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              [Mail, "contato@gfsvariemix.com.br"],
              [Phone, "Atendimento comercial em horario comercial"],
              [MapPin, "Operacao brasileira com foco em distribuicao"],
              [Building2, "Loja virtual e gestao administrativa integrada"],
            ].map(([Icon, text]) => (
              <div key={String(text)} className="motion-card flex items-center gap-3 rounded-lg border border-[#dbe4f0] bg-white p-4 shadow-sm">
                <Icon className="text-[#063f8f]" size={21} />
                <span className="text-sm font-bold text-[#202838]">{String(text)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="motion-card rounded-lg border border-[#dbe4f0] bg-white p-6 shadow-xl">
          <h2 className="font-display text-2xl font-black text-[#202838]">Enviar mensagem</h2>
          <p className="mb-6 mt-2 text-sm text-[#66758a]">Os contatos ficam salvos no banco para tratamento posterior.</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
