import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header/Header";
import AppProvider from "./AppProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });
const cookieStore = cookies();
const sessionToken = cookieStore.get("sessionToken");
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster></Toaster>
        <AppProvider initialSession={sessionToken?.value}>
          <Header></Header>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
