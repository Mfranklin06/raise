import type { Metadata } from "next";
import ThemeRegistry from "./components/themeRegistry";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import './globals.css'
import Header from "./components/Header";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextThemeProvider attribute={"class"} defaultTheme="dark" enableSystem={false}>
          <Header />
          <main className="flex-1">
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </main>
        </NextThemeProvider>
      </body>
    </html>
  );
}
