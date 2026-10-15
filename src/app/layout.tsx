import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

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
      <body className={`${inter.variable} antialiased bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
