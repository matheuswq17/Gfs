# GFS Variemix Brasil

E-commerce funcional em Next.js, TypeScript, Tailwind CSS, Prisma e Mercado Pago, criado para a marca brasileira **GFS Variemix Brasil**.

## O que esta pronto

- Home comercial com vitrine, busca, blocos de credibilidade e blog.
- Catalogo com busca, filtros por categoria e ordenacao.
- Pagina individual de produto com SKU, estoque, descricao e especificacoes.
- Carrinho persistente no navegador.
- Checkout com validacao de estoque no servidor.
- Integracao Mercado Pago via Preference para Pix e cartao.
- Webhook para atualizar pagamento e baixar estoque quando aprovado.
- Cadastro, login e sessao por cookie httpOnly.
- Minha conta com pedidos do usuario.
- Painel admin protegido por papel `ADMIN`.
- CRUD de produtos, upload local de imagens, pedidos e CRUD de blog.
- Contato com persistencia no banco.
- Seed com os 5 produtos informados e 3 posts.

## Setup local

```bash
npm install
npm run setup
npm run dev
```

Acesse:

- Loja: http://localhost:3000
- Admin: http://localhost:3000/admin

Credenciais seed:

- Admin: `admin@gfsvariemix.com.br` / `Admin@12345`
- Cliente: `cliente@gfsvariemix.com.br` / `Cliente@12345`

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="troque-por-uma-string-longa-e-unica"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
MERCADO_PAGO_ACCESS_TOKEN=""
MERCADO_PAGO_PUBLIC_KEY=""
MERCADO_PAGO_WEBHOOK_SECRET=""
```

Sem `MERCADO_PAGO_ACCESS_TOKEN`, o checkout salva o pedido e mostra uma tela clara de configuracao pendente. Com token de sandbox ou producao, o checkout redireciona para o Mercado Pago e permite pagar por Pix ou cartao.

## Mercado Pago

1. Crie uma aplicacao no painel de desenvolvedores do Mercado Pago.
2. Use primeiro as credenciais de sandbox em `MERCADO_PAGO_ACCESS_TOKEN`.
3. Configure `NEXT_PUBLIC_APP_URL` com a URL publica da loja.
4. Cadastre o webhook:

```txt
https://sua-url.com/api/mercado-pago/webhook
```

Quando o pagamento volta como aprovado, o pedido muda para `PAID`, o pagamento para `APPROVED` e o estoque dos produtos e decrementado.

## Banco de dados

O projeto vem com SQLite para rodar imediatamente em qualquer maquina:

```env
DATABASE_URL="file:./dev.db"
```

Para publicar com Supabase/PostgreSQL, troque o provider em `prisma/schema.prisma` para `postgresql`, use a connection string do Supabase em `DATABASE_URL`, rode `npx prisma db push` e depois `npm run db:seed`.

## Onde trocar marca e produtos

- Logo: `public/brand/gfs-logo.svg`
- Imagens dos produtos: `public/products/`
- Seed dos 5 produtos: `prisma/seed.ts`
- Cores e acabamento visual: `src/app/globals.css`
- Produtos em producao: `/admin/produtos`

Catalogo atual do seed:

- Pacote de Figurinhas Copa do Mundo 2026 Panini
- Kit Bandagem Elástica VFG 3 Metros Preta + Protetor Bucal Vollo
- Óculos Esportivo para Beach Tennis, Ciclismo e Corrida
- Kit 3 Macacão Malha Liso Bebê Manga Curta Menina/Menino
- Par de Luvas de Boxe e Muay Thai Cor Preta Vollo

As fotos reais recebidas estao em `public/products/` e podem ser substituidas pelo painel admin quando necessario.

## Comandos uteis

```bash
npm run lint
npm run build
npm run db:push
npm run db:seed
```
