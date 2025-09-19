// src/app/components/QuickAccess.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function QuickAccess() {
  return (
    <section aria-labelledby="quick-access-title" className="py-16 px-4 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center gap-6">
          <h3 id="quick-access-title" className="text-3xl font-bold text-foreground">Acesso Rápido</h3>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Gerencie suas salas de forma eficiente e sustentável
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/salas" className="inline-block">
              <button
                aria-label="Ver todas as salas"
                className="px-6 py-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5
                           bg-primary text-primary-foreground"
              >
                Ver Todas as Salas
              </button>
            </Link>

            <Link href="/relatorios" className="inline-block">
              <button
                aria-label="Ver relatórios de eficiência"
                className="px-6 py-3 rounded-lg border transition hover:bg-white/5
                           border-border text-foreground bg-transparent"
              >
                Relatórios de Eficiência
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
