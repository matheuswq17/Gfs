import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail valido.").toLowerCase(),
  password: z.string().min(8, "Use ao menos 8 caracteres."),
});

export const loginSchema = z.object({
  email: z.email("Informe um e-mail valido.").toLowerCase(),
  password: z.string().min(1, "Informe sua senha."),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        sku: z.string().optional(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "O carrinho esta vazio."),
  buyer: z.object({
    name: z.string().min(2, "Informe o nome do comprador."),
    email: z.email("Informe um e-mail valido.").toLowerCase(),
    phone: z.string().min(8, "Informe um telefone."),
    document: z.string().optional(),
    cep: z.string().min(8, "Informe o CEP."),
    addressLine: z.string().min(3, "Informe o endereco."),
    number: z.string().min(1, "Informe o numero."),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Informe o bairro."),
    city: z.string().min(2, "Informe a cidade."),
    state: z.string().min(2, "Informe o estado."),
  }),
  paymentMethod: z.enum(["PIX", "CARD"]),
});

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  slug: z.string().min(2),
  priceCents: z.number().int().min(1),
  stock: z.number().int().min(0),
  shortDescription: z.string().min(8),
  description: z.string().min(12),
  specifications: z.string().default("{}"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string().min(1),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).default([]),
});

export const blogPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(8),
  content: z.string().min(20),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail valido.").toLowerCase(),
  phone: z.string().optional(),
  subject: z.string().min(3, "Informe o assunto."),
  message: z.string().min(10, "Escreva uma mensagem um pouco mais completa."),
});
