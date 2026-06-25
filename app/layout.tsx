import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Nunito, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Payment from "@/components/payment";

const nunito = Nunito({
  weight: ["1000", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
  variable: "--font-nunito",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Finova - Personal Finance Manager",
  description: "Track your expenses, manage budgets, and connect bank accounts seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <Payment />
        <body
          className={`${nunito.variable} ${montserrat.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
