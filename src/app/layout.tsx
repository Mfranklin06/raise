import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "./components/themeRegistry";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import './globals.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import { MqttProvider } from "../context/mqtt-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "RAISE",
  description: "Rede de Automação Institucional por Sistemas Embarcados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col" suppressHydrationWarning>
        <NextThemeProvider attribute={"class"} defaultTheme="dark" enableSystem={false}>
          <header>
            <Header />
          </header>
          <main className="flex-1">
            <ThemeRegistry>
              <MqttProvider>
                {children}
              </MqttProvider>
            </ThemeRegistry>
          </main>
          <footer>
            <Footer />
          </footer>
        </NextThemeProvider>
      </body>
    </html>
  );
}
