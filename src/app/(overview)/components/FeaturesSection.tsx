"use client";

import { BsLightningCharge } from "react-icons/bs";
import { FaLeaf } from "react-icons/fa";
import { IoBarChartOutline, IoSettingsOutline } from "react-icons/io5";


const features = [
  {
    icon: BsLightningCharge,
    title: "Eficiência Energética",
    description:
      "Otimização do uso de energia elétrica em sistemas de climatização, via pré-configuração de parâmetros em IoT's.",
  },
  {
    icon: IoSettingsOutline,
    title: "Fácil Controle",
    description:
      "Interface intuitiva para ajuste de parâmetros, como temperatura, ventilação e modo de operação em tempo real.",
  },
  {
    icon: IoBarChartOutline,
    title: "Monitoramento em Tempo Real",
    description:
      "Sistema de monitoramento em tempo real que facilita a ação humana.",
  },
  {
    icon: FaLeaf,
    title: "Sustentabilidade",
    description:
      "Contribuição para práticas sustentáveis de economia de energia elétrica, evitando desperdícios.",
  },
];

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
        <div
          className="text-center mb-16"
        >
          {/*
          obs: faz parte da limpeza do código
          <motion.div variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary-strong backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-strong opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-strong"></span>
              </span>
              Nossos Diferenciais
            </div>
          </motion.div>
          */
          }

          <h2
            className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Recursos Principais
          </h2>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Tecnologia avançada para controle inteligente de climatização com foco em eficiência energética
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/** vale a mudança em tamanhos dos cards */}
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <article
                key={i}
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

                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    {f.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
