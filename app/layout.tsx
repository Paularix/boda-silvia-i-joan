import { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Boda de Silvia & Joan",
  description: "¡Nos casamos! Confirma tu asistencia aquí.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1", // Evita zoom raro en móviles
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap" rel="stylesheet" />
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}