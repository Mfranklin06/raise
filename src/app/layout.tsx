import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
                <html lang="en" className={`${geistSans.variable} ${geistMono.variable} flex flex-col`}>
                        <body className="font-sans min-h-screen mt-auto">
                                <header>
                                        <Header />
                                </header>
                                <MqttProvider>
                                        {children}
                                </MqttProvider>
                                <footer className="mt-auto">
                                        <Footer />
                                </footer>
                        </body>
                </html>
        );
}
