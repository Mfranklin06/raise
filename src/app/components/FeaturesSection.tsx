"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Zap, Settings, BarChart3, Leaf } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Eficiência Energética",
    description:
      "Otimização automática do consumo de energia com algoritmos inteligentes que reduzem custos operacionais.",
  },
  {
    icon: Settings,
    title: "Controle Inteligente",
    description:
      "Interface intuitiva para ajuste de parâmetros como temperatura, ventilação e modo de operação em tempo real.",
  },
  {
    icon: BarChart3,
    title: "Monitoramento em Tempo Real",
    description:
      "Acompanhamento contínuo de métricas de desempenho, consumo e status de todos os equipamentos.",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    description:
      "Contribuição para práticas sustentáveis com relatórios de impacto ambiental e economia de recursos.",
  },
];

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

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-background overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none bg-grid-pattern"
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
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
              Nossos Diferenciais
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Recursos Principais
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Tecnologia avançada para controle inteligente de climatização com foco em eficiência energética
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={i}
                variants={fadeUp}
                className="group relative bg-card/70 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-border transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl"
                aria-labelledby={`feature-${i}-title`}
                role="article"
              >
                <div className="flex flex-col items-center text-center h-full relative z-10">
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-primary-strong" />
                    </div>
                  </div>

                  <h3 id={`feature-${i}-title`} className="text-xl font-semibold mb-3 text-foreground">
                    {f.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
