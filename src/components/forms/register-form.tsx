"use client";

import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
      }),
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Nao foi possivel criar o cadastro.");
      return;
    }

    window.location.assign("/minha-conta");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">Nome</span>
        <input name="name" required className="form-input" placeholder="Seu nome ou empresa" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">E-mail</span>
        <input name="email" type="email" required className="form-input" placeholder="voce@empresa.com.br" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">Senha</span>
        <input name="password" type="password" minLength={8} required className="form-input" placeholder="Minimo de 8 caracteres" />
      </label>
      <button
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#20a33a] px-5 text-sm font-black text-white transition hover:bg-[#188a30] disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
        Criar conta
      </button>
      <p className="text-center text-sm font-bold text-[#66758a]">
        Ja possui conta?{" "}
        <Link href="/login" className="text-[#063f8f]">
          Entrar
        </Link>
      </p>
    </form>
  );
}
