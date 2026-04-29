import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Carrinho",
};

export default function CartRoutePage() {
  return <CartPage />;
}
