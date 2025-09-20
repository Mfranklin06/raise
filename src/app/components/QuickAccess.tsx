// src/app/components/QuickAccess.tsx
"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function QuickAccess() {
  return (
    <section aria-labelledby="quick-access-title" className="py-16 px-4 bg-background/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center gap-6">
          <h3 id="quick-access-title" className="text-3xl font-bold text-foreground">Acesso Rápido</h3>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Gerencie suas salas de forma eficiente e sustentável
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              component={Link}
              href="/salas"
              variant="outlined"
              className="text-foreground px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
              sx={{
                borderColor: "var(--border)",
                "&:hover": {
                  backgroundColor: "var(--primary)",
                  color: "var(--muted)"
                },
                color: "var(--primary-strong)"
              }}
            >
              Ver Todas as Salas
            </Button>

            <Button
              component={Link}
              href="/relatorios"
              variant="outlined"
              className="text-foreground px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
              sx={{
                borderColor: "var(--border)",
                "&:hover": {
                  backgroundColor: "var(--primary)",
                  color: "var(--muted)"
                },
                color: "var(--primary-strong)"
              }}>
              Relatórios de Eficiência
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
