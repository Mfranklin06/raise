// src/app/components/AboutSection.tsx
"use client";

import Image from "next/image";
import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen py-20 bg-black/90 ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: text + small feature boxes */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
              Sobre a RAISE
            </h2>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
              A RAISE é uma solução inovadora de controle inteligente de climatização, desenvolvida com foco em
              eficiência energética e sustentabilidade. Nossa plataforma oferece controle preciso e automação
              inteligente para otimizar o consumo de energia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Box 1 */}
              <div className="bg-white/80 dark:bg-green-900/10 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border hover:border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Economia de Energia</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Redução de até 45% no consumo energético através de algoritmos de otimização inteligente.
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-white/80 dark:bg-green-900/10 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border hover:border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interface Intuitiva</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Controle fácil e intuitivo de todos os parâmetros através de uma interface moderna e responsiva.
                </p>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-dashboard.jpg"
                alt="Dashboard EcoControl"
                width={640}
                height={640}
                className="object-cover w-full h-auto"
                priority
                sizes="(max-width: 1024px) 400px, 640px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
