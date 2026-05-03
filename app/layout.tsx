import type { Metadata } from "next";
import { Fredoka, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${fredoka.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <ToastProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <AuthModal />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
