import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopHub | Tu tienda de tecnología",
  description:
    "Plataforma de comercio electrónico construida con Next.js, React Context y la API pública de DummyJSON.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main className="page">{children}</main>
          <footer className="container footer">
            <p>
              ShopHub — Preparcial de Next.js App Router · Datos de{" "}
              <a
                href="https://dummyjson.com/products"
                target="_blank"
                rel="noopener noreferrer"
              >
                DummyJSON
              </a>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
