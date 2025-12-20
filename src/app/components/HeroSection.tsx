// components/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Activity, FileText } from "lucide-react";
import HeroScene from "./HeroScene"; // Importe o componente 3D criado acima

// Variantes de animação para reuso e código limpo
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center bg-background overflow-hidden"
      aria-label="Hero - RAISE"
    >
      {/* --- BACKGROUND TECH --- */}
      {/* Grid Pattern sutil usando CSS puro */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none bg-grid-pattern"
      />

      {/* Vignette (sombra nas bordas) para focar no centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* --- ESQUERDA: Conteúdo --- */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col justify-center text-left"
          >
            {/* Badge Tecnológico */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary-strong backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-strong opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-strong"></span>
                </span>
                Sistema de Climatização v2.0
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                RAISE
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mt-2 text-muted-foreground">
                Eficiência Energética <span className="text-primary-strong font-medium">Inteligente</span>
              </h2>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Gerencie seus sistemas de climatização com algoritmos preditivos.
              Sustentabilidade e economia de energia unificadas em uma plataforma.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* Botão Primário Customizado (Substituindo MUI) */}
              <Link
                href="/salas"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-base bg-primary-strong rounded-lg overflow-hidden transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] focus:ring-2 focus:ring-ring focus:outline-none shadow-lg shadow-primary/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Acessar Salas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Botão Secundário Customizado */}
              <Link
                href="/relatorios"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-transparent border border-border rounded-lg transition-all hover:bg-secondary hover:text-secondary-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <FileText className="w-4 h-4 mr-2 opacity-70" />
                Ver Relatórios
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={fadeUp} className="mt-12 pt-8 flex gap-8 sm:gap-12">
              <div>
                <div className="flex items-center gap-2 text-primary-strong mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Economia</span>
                </div>
                <p className="text-2xl font-bold text-foreground">-25%</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-strong">Uptime</span>
                </div>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- DIREITA: Visual 3D --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center"
          >
            {/* Círculos decorativos atrás do 3D */}
            <div className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -z-10" />

            {/* Canvas 3D */}
            <HeroScene />

            {/* Card Flutuante (Glassmorphism) sobre o 3D */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-10 right-0 lg:right-10 bg-card/70 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl max-w-[200px]"
            >
              <p className="text-xs text-muted-foreground mb-1">Status da Rede</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-strong animate-pulse" />
                <span className="text-sm font-semibold text-foreground">Otimizando Fluxo</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}