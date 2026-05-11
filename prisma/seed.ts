import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Colecionáveis", slug: "colecionaveis" },
  { name: "Esportes", slug: "esportes" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "Infantil", slug: "infantil" },
];

const products = [
  {
    name: "Pacote de Figurinhas Copa do Mundo 2026 Panini",
    sku: "GFS-FIG-001",
    slug: "pacote-figurinhas-copa-do-mundo-2026-panini",
    priceCents: 1490,
    stock: 120,
    categorySlug: "colecionaveis",
    featured: true,
    images: [
      "/products/figurinhas-copa-2026-panini-1.jpeg",
      "/products/figurinhas-copa-2026-panini-2.jpeg",
    ],
    shortDescription:
      "Envelope oficial Panini da Copa do Mundo FIFA 2026 com 7 cromos para colecionar.",
    description:
      "Pacote de figurinhas Panini da Copa do Mundo FIFA 2026, ideal para colecionadores, revenda e reposicao de estoque em lojas de variedades. Produto de alto giro, facil de expor e com forte apelo para publico infantil, jovem e adulto.",
    specs: {
      marca: "Panini",
      evento: "Copa do Mundo FIFA 2026",
      conteudo: "7 cromos por envelope",
      tipo: "pacote de figurinhas",
    },
  },
  {
    name: "Kit Bandagem Elástica VFG 3 Metros Preta + Protetor Bucal Vollo",
    sku: "GFS-VOL-002",
    slug: "kit-bandagem-elastica-vfg-3m-preta-protetor-bucal-vollo",
    priceCents: 5990,
    stock: 36,
    categorySlug: "esportes",
    featured: true,
    images: [
      "/products/kit-bandagem-protetor-vollo-1.jpeg",
      "/products/kit-bandagem-protetor-vollo-2.jpeg",
      "/products/kit-bandagem-protetor-vollo-3.jpeg",
      "/products/kit-bandagem-protetor-vollo-4.jpeg",
      "/products/kit-bandagem-protetor-vollo-5.jpeg",
      "/products/kit-bandagem-protetor-vollo-6.jpeg",
    ],
    shortDescription:
      "Kit Vollo com bandagem elástica preta de 3 metros e protetor bucal com estojo.",
    description:
      "Conjunto indicado para treinos de boxe, muay thai e artes marciais. A bandagem auxilia na proteção dos punhos e das mãos, enquanto o protetor bucal ajuda a reduzir impactos durante a prática esportiva. Um kit compacto, comercial e pronto para venda unitária.",
    specs: {
      marca: "Vollo",
      bandagem: "3 m x 5 cm",
      cor: "preta",
      protetor: "bucal preto com estojo",
      indicacao: "boxe, muay thai e artes marciais",
    },
  },
  {
    name: "Óculos Esportivo para Beach Tennis, Ciclismo e Corrida",
    sku: "GFS-ACE-003",
    slug: "oculos-esportivo-beach-tennis-ciclismo-corrida",
    priceCents: 7990,
    stock: 28,
    categorySlug: "acessorios",
    featured: false,
    images: ["/products/oculos-esportivo-1.jpeg"],
    shortDescription:
      "Óculos esportivo versátil para beach tennis, pedal, corrida e atividades ao ar livre.",
    description:
      "Óculos esportivo pensado para rotinas de movimento, lazer e treino. Produto leve, fácil de vender em loja de variedades e com boa aplicação para beach tennis, ciclismo, corrida e uso casual esportivo.",
    specs: {
      uso: "beach tennis, ciclismo e corrida",
      categoria: "acessorio esportivo",
      publico: "adulto",
      imagem: "foto real recebida",
    },
  },
  {
    name: "Kit 3 Macacão Malha Liso Bebê Manga Curta Menina/Menino",
    sku: "GFS-BEB-004",
    slug: "kit-3-macacao-malha-liso-bebe-manga-curta",
    priceCents: 6990,
    stock: 24,
    categorySlug: "infantil",
    featured: true,
    images: ["/products/kit-macacao-bebe-1.jpeg"],
    shortDescription:
      "Kit com 3 macacões de malha lisa para bebê, manga curta, uso menina ou menino.",
    description:
      "Kit prático para enxoval e reposição infantil. Composto por 3 macacões de malha lisa, manga curta, com proposta unissex para menina ou menino. Produto de boa saída para presentes, uso diário e compra recorrente.",
    specs: {
      quantidade: "3 unidades",
      tecido: "malha lisa",
      manga: "curta",
      publico: "bebê menina ou menino",
      imagem: "foto real recebida",
    },
  },
  {
    name: "Par de Luvas de Boxe e Muay Thai Cor Preta Vollo",
    sku: "GFS-VOL-005",
    slug: "par-luvas-boxe-muay-thai-preta-vollo",
    priceCents: 21990,
    stock: 18,
    categorySlug: "esportes",
    featured: true,
    images: [
      "/products/luvas-boxe-muay-thai-vollo-1.jpeg",
      "/products/luvas-boxe-muay-thai-vollo-2.jpeg",
      "/products/luvas-boxe-muay-thai-vollo-3.jpeg",
    ],
    shortDescription:
      "Par de luvas Vollo na cor preta para treinos de boxe, muay thai e artes marciais.",
    description:
      "Luvas de boxe e muay thai Vollo com acabamento preto, visual discreto e pegada esportiva. Indicadas para treino, iniciantes e praticantes que buscam protecao nas maos durante atividades de impacto.",
    specs: {
      marca: "Vollo",
      cor: "preta",
      tipo: "par de luvas",
      uso: "boxe, muay thai e artes marciais",
      acabamento: "preto esportivo",
    },
  },
];

const posts = [
  {
    title: "Catalogo atualizado com produtos reais",
    slug: "catalogo-atualizado-com-produtos-reais",
    excerpt:
      "A vitrine da GFS Variemix Brasil agora trabalha com os produtos reais enviados para o projeto.",
    content:
      "O catalogo foi atualizado para manter apenas os itens reais informados para a loja: figurinhas Panini da Copa do Mundo 2026, kit Vollo de bandagem com protetor bucal, oculos esportivo, kit de macacao bebe e luvas Vollo para boxe e muay thai. A estrutura continua pronta para editar preco, estoque, imagens e descricoes pelo painel administrativo.",
    coverImage: "/products/figurinhas-copa-2026-panini-1.jpeg",
  },
  {
    title: "Linha esportiva ganha destaque na loja",
    slug: "linha-esportiva-ganha-destaque-na-loja",
    excerpt:
      "Produtos Vollo e acessórios esportivos reforçam a proposta de variedade comercial da marca.",
    content:
      "A linha esportiva concentra produtos com boa leitura visual e compra objetiva. O kit de bandagem com protetor bucal e o par de luvas Vollo atendem praticantes de boxe, muay thai e artes marciais, enquanto o óculos esportivo amplia o catálogo para beach tennis, ciclismo e corrida.",
    coverImage: "/products/kit-bandagem-protetor-vollo-1.jpeg",
  },
  {
    title: "Como trocar imagens e estoque pelo painel",
    slug: "como-trocar-imagens-e-estoque-pelo-painel",
    excerpt:
      "O admin permite substituir fotos, ajustar descricoes, precos e estoque sem mexer no codigo.",
    content:
      "Para atualizar um produto, acesse o painel administrativo, entre em Produtos e edite o item desejado. É possível alterar nome, SKU, slug, preço, estoque, descrições, especificações, imagens, destaque e status de publicação. Produtos sem foto real podem receber imagens novas assim que os arquivos finais estiverem disponíveis.",
    coverImage: "/products/luvas-boxe-muay-thai-vollo-1.jpeg",
  },
];

async function main() {
  await prisma.contactMessage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany();

  const categoryBySlug = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryBySlug.set(category.slug, created.id);
  }

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        priceCents: product.priceCents,
        stock: product.stock,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: JSON.stringify(product.specs),
        featured: product.featured,
        categoryId,
        images: {
          create: product.images.map((image, index) => ({
            url: image,
            alt: product.name,
            sortOrder: index,
          })),
        },
      },
    });
  }

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        ...post,
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.create({
    data: {
      name: "Administrador GFS",
      email: "admin@gfsvariemix.com.br",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Cliente Exemplo",
      email: "cliente@gfsvariemix.com.br",
      passwordHash: await bcrypt.hash("Cliente@12345", 12),
      role: "USER",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
