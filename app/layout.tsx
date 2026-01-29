import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalWhatsApp } from "./GlobalWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pediddo - Delivery de Comida",
  description: "O melhor delivery de comida da cidade. Hambúrgueres, pizzas, bebidas e muito mais!",
  keywords: ["delivery", "comida", "hambúrguer", "pizza", "restaurante", "pediddo"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ef4444",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <GlobalWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
