import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "financeApp",
  description: "Sistema de gestão financeira pessoal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-zinc-50">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}