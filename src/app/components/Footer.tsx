// src/app/components/Footer.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block">
              <h4 className="text-xl font-bold">RAISE</h4>
            </Link>
            <div className="h-[0.1rem] w-12 bg-muted-foreground mt-1 mb-4" />
            <p className="text-sm opacity-90">Automação institucional inteligente para os Institutos Federais.</p>
          </div>

          <div>
            <h5 className="font-semibold mb-3">Navegação</h5>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/#home">Home</Link></li>
              <li><Link href="/#features">Recursos</Link></li>
              <li><Link href="/#about">Sobre</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-3">Suporte</h5>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link href="/documentacao">Documentação</Link></li>
              <li><Link href="/suporte">Suporte Técnico</Link></li>
              <li><Link href="/privacidade">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-3">Contato</h5>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">🐙</Link>
              <Link href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</Link>
              <Link href="mailto:contato@ecocontrol-system.com.br" aria-label="Email">✉️</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6">
          <p className="text-center text-sm opacity-80">
            © {new Date().getFullYear()} RAISE - Rede de Automação Institucional por Sistemas Embarcados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
