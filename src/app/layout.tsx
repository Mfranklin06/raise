import type { Metadata } from "next";
import ThemeRegistry from "./components/themeRegistry";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import './globals.css'

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
        <main className="flex-1">
          <NextThemeProvider attribute={"class"} defaultTheme="dark" enableSystem={false}>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </NextThemeProvider>
        </main>
      </body>
    </html>
  );
}
