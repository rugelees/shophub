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
  title: "ShopHub",
  description:
    "Tienda web construida con Next.js, React Context y la API de DummyJSON.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main className="page">{children}</main>
          <footer className="container footer">
            <p>ShopHub — Hecho con Next.js · Datos de DummyJSON</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
