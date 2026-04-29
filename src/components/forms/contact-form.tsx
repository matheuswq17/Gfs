"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        subject: String(form.get("subject") || ""),
        message: String(form.get("message") || ""),
      }),
    });

    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(data?.error || "Nao foi possivel enviar sua mensagem.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Mensagem recebida. A equipe comercial pode acompanhar este contato no banco de dados.");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {message && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-black text-[#202838]">Nome</span>
          <input name="name" required className="form-input" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-black text-[#202838]">E-mail</span>
          <input name="email" type="email" required className="form-input" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-black text-[#202838]">Telefone</span>
          <input name="phone" className="form-input" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-black text-[#202838]">Assunto</span>
          <input name="subject" required className="form-input" />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#202838]">Mensagem</span>
        <textarea name="message" required rows={6} className="form-input resize-y" />
      </label>
      <button
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#063f8f] px-6 text-sm font-black text-white transition hover:bg-[#073271] disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        Enviar contato
      </button>
    </form>
  );
}
