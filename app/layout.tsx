/**
 * RootLayout — layout racine de l'application Next.js.
 * Tout ce qui est défini ici (Header, Footer, polices) s'applique
 * automatiquement à toutes les routes sans répétition.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/header";
import Footer from "./components/footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MonBLog",
  description: "B2LP — le blog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="mx-auto max-w-5xl px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
