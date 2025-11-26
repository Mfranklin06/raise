"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Grid Pattern (Same as Hero/Header) */}
            <div
                className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-xl shadow-2xl"
                >
                    <FileQuestion className="w-24 h-24 text-primary-strong opacity-80" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-8xl font-bold tracking-tighter text-foreground mb-2"
                >
                    404
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-medium text-muted-foreground mb-8"
                >
                    Página não encontrada
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="max-w-md text-muted-foreground mb-10 leading-relaxed"
                >
                    Opa! Parece que você se perdeu no sistema. A página que você está procurando não existe ou foi movida.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg overflow-hidden transition-all hover:bg-primary/90 hover:scale-[1.02] focus:ring-2 focus:ring-ring focus:outline-none shadow-lg shadow-primary/20"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Voltar ao Início
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
