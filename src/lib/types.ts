export type CartProduct = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  priceCents: number;
  image: string;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type ProductWithRelations = {
  id: string;
  name: string;
  sku: string;
  slug: string;
  priceCents: number;
  stock: number;
  shortDescription: string;
  description: string;
  specifications: string;
  featured: boolean;
  active: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt: string;
    sortOrder: number;
  }[];
};
