import { LayoutDashboard, Newspaper, Package, ReceiptText, Store } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ReceiptText },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#dbe4f0] bg-white p-5 lg:block">
        <div className="rounded-lg border border-[#dbe4f0] p-3">
          <BrandLogo />
        </div>
        <div className="mt-6 rounded-lg bg-[#063f8f] p-4 text-white">
          <p className="text-xs font-black uppercase text-[#f4b227]">Painel admin</p>
          <p className="mt-2 font-display text-xl font-black">{userName}</p>
        </div>
        <nav className="mt-6 grid gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black text-[#202838] transition hover:bg-[#edf4fb]"
            >
              <item.icon size={19} className="text-[#063f8f]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-6 flex items-center gap-3 rounded-lg border border-[#dbe4f0] px-4 py-3 text-sm font-black text-[#202838]"
        >
          <Store size={19} className="text-[#20a33a]" />
          Ver loja
        </Link>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-[#dbe4f0] bg-white/95 backdrop-blur lg:hidden">
          <div className="container-gfs flex items-center justify-between py-3">
            <BrandLogo />
            <Link href="/" className="rounded-lg bg-[#063f8f] px-3 py-2 text-sm font-black text-white">
              Loja
            </Link>
          </div>
          <nav className="container-gfs flex gap-2 overflow-x-auto pb-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg border border-[#dbe4f0] bg-white px-3 py-2 text-sm font-black">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
