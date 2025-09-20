"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Typography, Stack, Box } from "@mui/material";
import React from "react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-16 flex items-center bg-background/80 text-foreground overflow-hidden" //hero-gradient
      aria-label="Hero - RAISE"
    >
      {/* decorative blurred blobs */}
      <div className="absolute -left-32 -top-20 w-72 h-72 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute right-8 top-24 w-40 h-40 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: content */}
          <div className="textforeground">
            <Stack spacing={6} className="max-w-2xl">
              <div>
                <Typography
                  component="h1"
                  variant="h2"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
                >
                  RAISE
                </Typography>
                <Typography
                  component="span"
                  className="block text-2xl sm:text-3xl md:text-4xl font-light mt-2 opacity-90"
                >
                  Eficiência Energética Inteligente
                </Typography>
              </div>

              <Typography variant="body1" className="text-lg sm:text-xl text-foreground max-w-xl">
                Gerencie seus sistemas de climatização com foco em sustentabilidade, economia de energia e
                controle inteligente de última geração.
              </Typography>

              <div className="flex flex-row gap-4">
                <Button
                  component={Link}
                  href="/salas"
                  variant="outlined"
                  className="text-foreground px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  sx={{
                    borderColor: "var(--border)", 
                    "&:hover":{
                      backgroundColor:"var(--primary)",
                      color: "var(--muted)"
                    }, 
                    color: "var(--primary-strong)"
                  }}
                >
                  Acessar Salas
                </Button>

                <Button
                  component={Link}
                  href="/relatorios"
                  variant="outlined"
                  className="px-6 py-3 rounded-lg transition-all duration-300"
                  sx={{
                    borderColor: "var(--border)", 
                    "&:hover":{
                      backgroundColor:"var(--primary)",
                      color: "var(--muted)"
                    }, 
                    color: "var(--primary-strong)"
                  }}
                >
                  Ver Relatórios
                </Button>
              </div>
            </Stack>
          </div>

          {/* Right: illustration */}
          <Box className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-lg overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src="/hero-dashboard.jpg"
                alt="Painel de controle de eficiência energética"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 420px"
              />
            </div>
          </Box>
        </div>
      </div>
    </section>
  );
}
