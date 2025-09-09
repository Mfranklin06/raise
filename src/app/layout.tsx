import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./components/themeRegistry";

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
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <main className="bg-[#0e0c26] flex-1">
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </main>
      </body>
    </html>
  );
}
