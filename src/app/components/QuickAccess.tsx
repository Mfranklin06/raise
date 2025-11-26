"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, FileBarChart, ArrowRight } from "lucide-react";

export default function QuickAccess() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-primary/5 -z-20" />
      <div
        className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-primary/5"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pronto para Otimizar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Acesse o painel de controle completo ou visualize relatórios detalhados para começar a economizar energia hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/salas" className="w-full sm:w-auto group">
              <div className="relative overflow-hidden rounded-xl bg-primary px-8 py-4 transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-95">
                <div className="flex items-center justify-center gap-3 text-primary-foreground font-semibold">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Acessar Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link href="/relatorios" className="w-full sm:w-auto group">
              <div className="relative overflow-hidden rounded-xl bg-card border border-border px-8 py-4 transition-all duration-300 hover:bg-accent hover:border-primary/50 hover:scale-[1.02] active:scale-95">
                <div className="flex items-center justify-center gap-3 text-foreground font-medium">
                  <FileBarChart className="w-5 h-5 text-primary-strong" />
                  <span>Ver Relatórios</span>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
