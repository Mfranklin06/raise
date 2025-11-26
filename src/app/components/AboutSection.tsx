// src/app/components/AboutSection.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, Variants } from "framer-motion";
import {
  Zap,
  BarChart3,
  Sparkles,
  Shield,
  Cloud,
  Cpu,
} from "lucide-react";
import HeroScene from "./HeroScene";

// Variantes de animação consistentes com o HeroSection
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group relative bg-card/70 backdrop-blur-md rounded-lg p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300 border border-primary/20">
          <Icon className="w-6 h-6 text-primary-strong" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const features = [
    {
      icon: Zap,
      title: "Economia de Energia",
      description: "Redução de até 45% no consumo energético através de algoritmos de otimização inteligente.",
    },
    {
      icon: BarChart3,
      title: "Análise em Tempo Real",
      description: "Monitoramento contínuo com dashboards interativos e relatórios detalhados de consumo.",
    },
    {
      icon: Sparkles,
      title: "Interface Intuitiva",
      description: "Controle fácil e intuitivo de todos os parâmetros através de uma interface moderna e responsiva.",
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Proteção de dados com criptografia de ponta e autenticação segura para todos os dispositivos.",
    },
    {
      icon: Cloud,
      title: "Conectividade IoT",
      description: "Integração perfeita com dispositivos inteligentes através de protocolos MQTT e APIs REST.",
    },
    {
      icon: Cpu,
      title: "IA Preditiva",
      description: "Algoritmos de machine learning que preveem padrões de uso e otimizam o consumo automaticamente.",
    },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen py-20 bg-background overflow-hidden"
      aria-label="Sobre a RAISE"
    >
      {/* Grid Pattern Background (igual ao HeroSection) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary-strong backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-strong opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-strong"></span>
              </span>
              Sobre Nossa Plataforma
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4"
          >
            Sobre a RAISE
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            A RAISE é uma solução inovadora de controle inteligente de climatização, desenvolvida com foco em
            eficiência energética e sustentabilidade. Nossa plataforma oferece controle preciso e automação
            inteligente para otimizar o consumo de energia.
          </motion.p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {[
            { value: 45, suffix: "%", label: "Economia de Energia" },
            { value: 99, suffix: "%", label: "Tempo de Atividade" },
            { value: 24, suffix: "/7", label: "Suporte Contínuo" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative bg-card/70 backdrop-blur-md rounded-lg p-6 border border-border text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-4xl sm:text-5xl font-bold text-primary-strong mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Feature Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <FeatureCard
                  key={i}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end relative"
          >
            {/* 3D Effect reused from HeroSection - Positioned behind the image */}
            <div className="absolute inset-0 -z-10 scale-150 pointer-events-none flex items-center justify-center">
              <HeroScene className="!w-full !h-full opacity-80" />
            </div>
            <div className="relative group">
              {/* Círculo decorativo (igual ao HeroSection) */}
              <div className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

              {/* Image container */}
              <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-xl border border-border">
                <Image
                  src="/hero-dashboard.jpg"
                  alt="Dashboard RAISE"
                  width={640}
                  height={640}
                  className="object-cover w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 400px, 640px"
                />
              </div>

              {/* Card flutuante (glassmorphism igual ao HeroSection) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute bottom-4 right-4 bg-card/70 backdrop-blur-md border border-border p-4 rounded-lg shadow-xl max-w-[180px]"
              >
                <p className="text-xs text-muted-foreground mb-1">Consumo Atual</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-strong animate-pulse" />
                  <span className="text-sm font-semibold text-foreground">Otimizado</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
