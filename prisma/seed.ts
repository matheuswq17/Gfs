import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Organizacao", slug: "organizacao" },
  { name: "Limpeza", slug: "limpeza" },
  { name: "Descartaveis", slug: "descartaveis" },
  { name: "Ferramentas", slug: "ferramentas" },
  { name: "Embalagens", slug: "embalagens" },
];

const products = [
  {
    name: "Caixa Organizadora Modular 30L",
    sku: "GFS-ORG-001",
    slug: "caixa-organizadora-modular-30l",
    priceCents: 7490,
    stock: 42,
    categorySlug: "organizacao",
    featured: true,
    image: "/products/gfs-produto-01.svg",
    shortDescription: "Organizacao resistente para estoque, escritorio e areas operacionais.",
    description:
      "Caixa modular com encaixe firme, boa capacidade interna e acabamento facil de higienizar. Indicada para empresas que precisam manter itens variados separados, identificados e sempre acessiveis.",
    specs: {
      capacidade: "30 litros",
      material: "polipropileno reforcado",
      uso: "estoque, almoxarifado e escritorio",
      garantia: "90 dias contra defeitos de fabricacao",
    },
  },
  {
    name: "Kit Limpeza Profissional Multiuso",
    sku: "GFS-LMP-002",
    slug: "kit-limpeza-profissional-multiuso",
    priceCents: 11990,
    stock: 28,
    categorySlug: "limpeza",
    featured: true,
    image: "/products/gfs-produto-02.svg",
    shortDescription: "Conjunto pratico para rotinas de limpeza comercial.",
    description:
      "Kit pensado para reposicao rapida em negocios, condominios e pequenos centros de distribuicao. Reune itens de alto giro em uma solucao simples de comprar e controlar.",
    specs: {
      composicao: "balde, panos, pulverizador e acessorios",
      indicacao: "uso comercial leve e medio",
      armazenamento: "manter em local seco",
      validade: "conforme lote dos itens do kit",
    },
  },
  {
    name: "Dispenser de Papel Interfolha",
    sku: "GFS-DES-003",
    slug: "dispenser-de-papel-interfolha",
    priceCents: 5690,
    stock: 65,
    categorySlug: "descartaveis",
    featured: false,
    image: "/products/gfs-produto-03.svg",
    shortDescription: "Dispenser robusto para banheiros, cozinhas e areas de atendimento.",
    description:
      "Modelo discreto, de facil abastecimento e com boa resistencia para ambientes de circulacao intensa. Ajuda a padronizar o consumo e manter a apresentacao do espaco.",
    specs: {
      material: "plastico ABS",
      compatibilidade: "papel interfolha padrao",
      fixacao: "parede",
      cor: "branco com visor",
    },
  },
  {
    name: "Bobina Plastica Reforcada 5kg",
    sku: "GFS-EMB-004",
    slug: "bobina-plastica-reforcada-5kg",
    priceCents: 13850,
    stock: 21,
    categorySlug: "embalagens",
    featured: true,
    image: "/products/gfs-produto-04.svg",
    shortDescription: "Filme plastico para protecao, separacao e embalagem de volumes.",
    description:
      "Bobina de uso versatil para operacoes de despacho, armazenagem e protecao de mercadorias. Boa transparencia, resistencia ao manuseio e rendimento para uso continuo.",
    specs: {
      peso: "5 kg",
      aplicacao: "embalagem e protecao",
      rendimento: "alto giro",
      origem: "produto nacional",
    },
  },
  {
    name: "Luva Multiuso Nitrilica Verde",
    sku: "GFS-LMP-005",
    slug: "luva-multiuso-nitrilica-verde",
    priceCents: 1890,
    stock: 120,
    categorySlug: "limpeza",
    featured: false,
    image: "/products/gfs-produto-05.svg",
    shortDescription: "Protecao confortavel para limpeza, manuseio e pequenas rotinas.",
    description:
      "Luva de borracha nitrilica com boa aderencia e acabamento interno confortavel. Ideal para compras recorrentes em empresas que precisam manter reposicao simples.",
    specs: {
      tamanho: "P, M, G e GG",
      cor: "verde",
      material: "nitrilico",
      embalagem: "1 par",
    },
  },
  {
    name: "Fita Adesiva Alta Aderencia",
    sku: "GFS-EMB-006",
    slug: "fita-adesiva-alta-aderencia",
    priceCents: 2290,
    stock: 86,
    categorySlug: "embalagens",
    featured: true,
    image: "/products/gfs-produto-06.svg",
    shortDescription: "Fechamento firme para caixas, pacotes e operacoes de envio.",
    description:
      "Fita transparente de alto desempenho, com aderencia confiavel em papelao e embalagens comuns. Boa escolha para expedicao, estoque e rotinas administrativas.",
    specs: {
      largura: "48 mm",
      comprimento: "100 m",
      cor: "transparente",
      adesivo: "acrilico",
    },
  },
  {
    name: "Suporte Metalico de Organizacao",
    sku: "GFS-ORG-007",
    slug: "suporte-metalico-de-organizacao",
    priceCents: 8990,
    stock: 34,
    categorySlug: "organizacao",
    featured: false,
    image: "/products/gfs-produto-07.svg",
    shortDescription: "Apoio resistente para organizar materiais de uso diario.",
    description:
      "Suporte metalico com pintura resistente e desenho funcional para balcões, bancadas e areas de servico. Ajuda a reduzir perda de tempo na localizacao de itens.",
    specs: {
      material: "aco pintado",
      acabamento: "preto fosco",
      uso: "bancada e parede",
      manutencao: "limpeza com pano seco",
    },
  },
  {
    name: "Pulverizador Manual 1,5L",
    sku: "GFS-FER-008",
    slug: "pulverizador-manual-15l",
    priceCents: 3490,
    stock: 52,
    categorySlug: "ferramentas",
    featured: true,
    image: "/products/gfs-produto-08.svg",
    shortDescription: "Aplicacao precisa para limpeza, jardinagem e manutencao leve.",
    description:
      "Pulverizador leve, com acionamento firme e regulagem de jato. Atende rotinas de pequenos negocios, manutencao predial e uso domestico organizado.",
    specs: {
      capacidade: "1,5 litro",
      bico: "regulavel",
      acionamento: "manual",
      indicacao: "liquidos nao corrosivos",
    },
  },
  {
    name: "Cabo Extensor Telescopico",
    sku: "GFS-FER-009",
    slug: "cabo-extensor-telescopico",
    priceCents: 6790,
    stock: 39,
    categorySlug: "ferramentas",
    featured: false,
    image: "/products/gfs-produto-09.svg",
    shortDescription: "Alcance extra para limpeza, pintura e manutencao.",
    description:
      "Cabo telescopico com ajuste simples e pegada segura. Um item util para equipes que precisam executar tarefas em altura moderada com mais conforto.",
    specs: {
      extensao: "ate 2 metros",
      material: "aluminio",
      encaixe: "rosca padrao",
      peso: "leve",
    },
  },
  {
    name: "Saco Reforcado para Transporte",
    sku: "GFS-EMB-010",
    slug: "saco-reforcado-para-transporte",
    priceCents: 4690,
    stock: 74,
    categorySlug: "embalagens",
    featured: false,
    image: "/products/gfs-produto-10.svg",
    shortDescription: "Embalagem forte para separacao, transporte e armazenagem.",
    description:
      "Saco reforcado para organizacao de volumes, separacao de materiais e pequenas operacoes logisticas. Resistente no manuseio e facil de armazenar em lote.",
    specs: {
      pacote: "100 unidades",
      espessura: "reforcada",
      cor: "transparente",
      aplicacao: "transporte e armazenamento",
    },
  },
];

const posts = [
  {
    title: "Como organizar compras recorrentes em uma empresa multissetorial",
    slug: "como-organizar-compras-recorrentes",
    excerpt:
      "Um processo simples para manter itens de alto giro sempre disponiveis sem travar o caixa.",
    content:
      "Empresas que compram itens variados costumam perder tempo quando cada reposicao vira uma nova busca. A recomendacao e separar produtos por giro, criticidade e fornecedor. Itens de limpeza, embalagens e organizacao devem ter ponto de reposicao definido, com revisao quinzenal ou mensal. A GFS Variemix Brasil foi estruturada para facilitar esse tipo de compra: catalogo claro, SKU visivel e checkout pronto para pedidos rapidos.",
    coverImage: "/products/gfs-produto-02.svg",
  },
  {
    title: "SKU bem cadastrado evita erro de pedido",
    slug: "sku-bem-cadastrado-evita-erro-de-pedido",
    excerpt:
      "Nome, codigo, imagem e especificacao reduzem retrabalho na compra e na separacao.",
    content:
      "Um SKU completo deve deixar claro o que esta sendo comprado antes do cliente abrir a pagina do produto. O cadastro precisa reunir nome objetivo, imagem, preco, estoque e especificacoes tecnicas. Esse cuidado melhora a experiencia do comprador e tambem facilita o trabalho administrativo no painel.",
    coverImage: "/products/gfs-produto-01.svg",
  },
  {
    title: "Novidades no catalogo: embalagens e organizacao",
    slug: "novidades-catalogo-embalagens-organizacao",
    excerpt:
      "Atualizacoes de linha podem ser comunicadas pelo blog sem poluir a vitrine principal.",
    content:
      "O blog da loja pode funcionar como um canal objetivo para avisos comerciais. Entradas de novos produtos, reposicao de estoque, kits sazonais e mudancas de linha ficam registradas em uma pagina propria, enquanto a home continua focada em venda e navegacao.",
    coverImage: "/products/gfs-produto-04.svg",
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
          create: [
            {
              url: product.image,
              alt: product.name,
              sortOrder: 0,
            },
          ],
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
