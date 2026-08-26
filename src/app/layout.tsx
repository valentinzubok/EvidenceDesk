import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SWRConfig } from "swr";
import { Background } from "@/components/Background";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { Analytics } from "@/components/Analytics";
import { ChainProvider } from "@/components/ChainProvider";
import { RoleProvider } from "@/components/RoleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evidence Desk — GenLayer dispute console",
  description: "Freeze web evidence and browse eq-principle criteria on GenLayer Studionet.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Background />
        <LocaleProvider>
          <ThemeProvider>
            <ChainProvider>
              <RoleProvider>
                <SWRConfig value={{ revalidateOnFocus: false }}>
                  <WalletProvider>
                    <ToastProvider>
                      <Analytics />
                      <div className="page-shell flex min-h-screen flex-col">
                        <Nav />
                        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
                          <PageShell>{children}</PageShell>
                        </main>
                        <Footer />
                      </div>
                    </ToastProvider>
                  </WalletProvider>
                </SWRConfig>
              </RoleProvider>
            </ChainProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
