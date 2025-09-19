// src/app/components/FeaturesSection.tsx
"use client";

import React from "react";
import { BoltIcon, CogIcon, ChartBarIcon, HeartIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: BoltIcon,
    title: "Eficiência Energética",
    description:
      "Otimização automática do consumo de energia com algoritmos inteligentes que reduzem custos operacionais.",
  },
  {
    icon: CogIcon,
    title: "Controle Inteligente",
    description:
      "Interface intuitiva para ajuste de parâmetros como temperatura, ventilação e modo de operação em tempo real.",
  },
  {
    icon: ChartBarIcon,
    title: "Monitoramento em Tempo Real",
    description:
      "Acompanhamento contínuo de métricas de desempenho, consumo e status de todos os equipamentos.",
  },
  {
    icon: HeartIcon,
    title: "Sustentabilidade",
    description:
      "Contribuição para práticas sustentáveis com relatórios de impacto ambiental e economia de recursos.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-black/90">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Recursos Principais</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tecnologia avançada para controle inteligente de climatização com foco em eficiência energética
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <article
                key={i}
                className="group bg-white/80 dark:bg-black/60 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border hover:border-green-500"
                aria-labelledby={`feature-${i}-title`}
                role="article"
              >
                <div className="flex flex-col items-center text-center h-full ">
                  <div className="mb-4">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-700 inline-flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-500 dark:text-white/80 group-hover:text-[#388E3C]"/>
                    </div>
                  </div>

                  <h3 id={`feature-${i}-title`} className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {f.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {f.description}
                  </p>

                  {/* Espaçador flex para manter o botão/footer alinhado se quiser */}
                  <div className="mt-auto" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
