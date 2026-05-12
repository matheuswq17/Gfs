import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "GFS Variemix Brasil | E-commerce e distribuicao multimarcas",
    template: "%s | GFS Variemix Brasil",
  },
  description:
    "Loja virtual brasileira de produtos variados com catalogo organizado, pagamento por Pix e cartao via Stripe e gestao administrativa.",
  openGraph: {
    title: "GFS Variemix Brasil",
    description: "Distribuidora multimarcas com e-commerce funcional, catalogo e checkout real.",
    url: "/",
    siteName: "GFS Variemix Brasil",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
