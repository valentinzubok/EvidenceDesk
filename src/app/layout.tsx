import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Nav } from "@/components/Nav";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evidence Desk — GenLayer dispute console",
  description:
    "Freeze web evidence and browse eq-principle criteria on GenLayer Studionet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider>
          <WalletProvider>
            <Nav />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </WalletProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
