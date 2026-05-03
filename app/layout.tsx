import type { Metadata } from "next";
import { Nunito, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spark Studio",
  description:
    "A remix-first AI coding playground for kids. Every AI-generated change becomes a learning moment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
