import type { Metadata } from "next";
import { Cormorant_Garamond, Work_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-worksans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShimmerShine — Catálogo de Joyería",
  description: "Catálogo de joyería en plata 925: anillos, cadenas, pulseras y aros.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
