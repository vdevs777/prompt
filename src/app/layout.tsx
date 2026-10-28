import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Sidebar } from "@/components/sidebar";

import "@/styles/globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Prompt Manager",
  description: "Gerencie seus prompts",
};

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-gray-900 text-white flex h-screen`}
      >
        <Suspense>
          <Sidebar />
        </Suspense>
        <main className="relative flex-1 overflow-auto min-w-0">
          <div className="p-4 sm:p-6 md:p-8 max-w-full md:max-w-3xl mx-auto h-full">
            {children}
          </div>
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
