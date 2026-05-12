# GFS Variemix Brasil

E-commerce funcional em Next.js, TypeScript, Tailwind CSS, Prisma e Stripe, criado para a marca brasileira **GFS Variemix Brasil**.

## O que esta pronto

- Home comercial com vitrine, busca, blocos de credibilidade e blog.
- Catalogo com busca, filtros por categoria e ordenacao.
- Pagina individual de produto com galeria clicavel, SKU, estoque, descricao e especificacoes.
- Carrinho persistente no navegador.
- Checkout com validacao de estoque no servidor.
- Integracao Stripe Checkout para Pix e cartao de credito/debito.
- Webhook Stripe para atualizar pagamento e baixar estoque quando aprovado.
- Cadastro, login e sessao por cookie httpOnly.
- Minha conta com pedidos do usuario.
- Painel admin protegido por papel `ADMIN`.
- CRUD de produtos, upload local de imagens, pedidos e CRUD de blog.
- Contato com persistencia no banco.
- Seed com os 5 produtos informados e 3 posts.

## Setup local

```bash
npm install
cp .env.example .env
# preencha DATABASE_URL e DIRECT_URL com as strings do Supabase
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
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="troque-por-uma-string-longa-e-unica"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_MAP=""
```

Sem `STRIPE_SECRET_KEY`, o checkout salva o pedido e mostra uma tela clara de configuracao pendente. Com a chave preenchida, o checkout redireciona para o Stripe e permite pagar por Pix ou cartao.

## Stripe

Os Price IDs dos 5 produtos ja estao mapeados por SKU em `src/lib/stripe.ts`.

Webhook para cadastrar no Stripe:

```txt
https://gfs-brown.vercel.app/api/stripe/webhook
```

Eventos recomendados:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Quando o pagamento volta como aprovado, o pedido muda para `PAID`, o pagamento para `APPROVED` e o estoque dos produtos e decrementado.

## Banco de dados

O projeto usa Supabase PostgreSQL via Prisma. No painel do Supabase, pegue as strings em:

- `Project Settings` > `Database` > `Connection string`
- Preferencialmente na aba/guia `ORMs` > `Prisma`, quando disponivel

Use:

- `DATABASE_URL`: Transaction Pooler/Supavisor, porta `6543`, para runtime na Vercel.
- `DIRECT_URL`: Session Pooler/Supavisor, porta `5432`, para `prisma db push` e outros comandos de schema. Se o painel oferecer a string Direct connection e ela funcionar no seu ambiente, tambem pode ser usada aqui.

Depois de preencher o `.env`, rode:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

O seed recria produtos, posts, admin e cliente de exemplo. Evite rodar `npm run db:seed` em producao depois que pedidos reais existirem, porque ele limpa tabelas antes de popular os dados.

## Onde trocar marca e produtos

- Logo: `public/brand/gfs-logo.jpeg`
- Icone da aba: `src/app/icon.png` e `src/app/favicon.ico`
- Imagens dos produtos: `public/products/`
- Seed dos 5 produtos: `prisma/seed.ts`
- Cores e acabamento visual: `src/app/globals.css`
- Produtos em producao: `/admin/produtos`

Catalogo atual do seed:

- Pacote de Figurinhas Copa do Mundo 2026 Panini
- Kit Bandagem Elastica VFG 3 Metros Preta + Protetor Bucal Vollo
- Oculos Esportivo para Beach Tennis, Ciclismo e Corrida
- Kit 3 Macacao Malha Liso Bebe Manga Curta Menina/Menino
- Par de Luvas de Boxe e Muay Thai Cor Preta Vollo

As fotos reais recebidas estao em `public/products/` e podem ser substituidas pelo painel admin quando necessario.

## Comandos uteis

```bash
npm run lint
npm run build
npm run db:push
npm run db:seed
```
