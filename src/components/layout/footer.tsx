import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-[#202838] text-white">
      <div className="brand-sweep border-t border-white/10">
        <div className="container-gfs grid gap-10 py-14 md:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-lg bg-white p-3">
              <BrandLogo variant="default" />
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/72">
              Comercio variado com organizacao de catalogo, compra simples e operacao preparada para
              distribuicao em todo o Brasil.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-black uppercase">Institucional</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              <Link href="/produtos" className="hover:text-white">
                Catalogo
              </Link>
              <Link href="/blog" className="hover:text-white">
                Atualizacoes
              </Link>
              <Link href="/contato" className="hover:text-white">
                Contato
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-black uppercase">Conta</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              <Link href="/login" className="hover:text-white">
                Entrar
              </Link>
              <Link href="/cadastro" className="hover:text-white">
                Criar cadastro
              </Link>
              <Link href="/minha-conta" className="hover:text-white">
                Meus pedidos
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-black uppercase">Atendimento</h3>
            <div className="mt-4 space-y-3 text-sm text-white/72">
              <p>contato@gfsvariemix.com.br</p>
              <p>Segunda a sexta, 8h as 18h</p>
              <p>Pix e cartao processados via Mercado Pago.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-gfs flex flex-col gap-2 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 GFS Variemix Brasil. Projeto de e-commerce funcional.</span>
          <span>Base pronta para substituir imagens, credenciais e produtos pelo painel.</span>
        </div>
      </div>
    </footer>
  );
}
