import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
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
  title: "Lista Supermercado",
  description: "Organiza tu búsqueda de productos por supermercado y categoría.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 w-full lg:pl-64 h-screen overflow-hidden">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
