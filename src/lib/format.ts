export function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function parseSpecs(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function getBaseUrl(origin?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/^\uFEFF/, "").trim();
  if (origin) return origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

export function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "Pedido recebido",
    PAID: "Pagamento aprovado",
    CANCELED: "Cancelado",
    FAILED: "Pagamento recusado",
  };

  return labels[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    WAITING: "Aguardando pagamento",
    APPROVED: "Aprovado",
    PENDING: "Em analise",
    REJECTED: "Recusado",
    FAILED: "Falhou",
    REFUNDED: "Estornado",
  };

  return labels[status] ?? status;
}