"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/minha-conta";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
      }),
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Nao foi possivel entrar.");
      return;
    }

    window.location.assign(next);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">E-mail</span>
        <input name="email" type="email" required className="form-input" placeholder="voce@empresa.com.br" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">Senha</span>
        <input name="password" type="password" required className="form-input" placeholder="Sua senha" />
      </label>
      <button
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-5 text-sm font-black text-white transition hover:bg-[#073271] disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        Entrar
      </button>
      <div className="flex items-center justify-between text-sm font-bold">
        <Link href="/cadastro" className="text-[#063f8f]">
          Criar cadastro
        </Link>
        <Link href="/contato" className="text-[#66758a]">
          Recuperar acesso
        </Link>
      </div>
    </form>
  );
}
