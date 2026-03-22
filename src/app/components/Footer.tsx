"use client";

import Link from "next/link";
import { BsArrowUpRight, BsGithub, BsLinkedin, BsMailbox } from "react-icons/bs";

export default function Footer() {
  return (
    <div className="bg-background border-t border-border">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="font-bold text-primary-strong">R</span>
                </div>
                <h4 className="text-xl font-bold text-foreground tracking-tight">RAISE</h4>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Rede de Automação Institucional por Sistemas Embarcados. Soluções inteligentes para eficiência energética.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h5 className="font-semibold text-foreground mb-4">Navegação</h5>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/#home" className="hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                  Home
                  <BsArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                  Recursos
                  <BsArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                  Sobre
                  <BsArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h5 className="font-semibold text-foreground mb-4">Suporte</h5>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/documentacao" className="hover:text-primary transition-colors duration-200">
                  Documentação
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="hover:text-primary transition-colors duration-200">
                  Suporte Técnico
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-primary transition-colors duration-200">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h5 className="font-semibold text-foreground mb-4">Contato</h5>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                aria-label="GitHub"
              >
                <BsGithub className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <BsLinkedin className="w-5 h-5" />
              </Link>
              <button
              // Implementar funcionalidade de email ou formulário de contato
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                aria-label="Email"
              >
                <BsMailbox className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            RAISE 2026.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Desenvolvido como projeto acadêmico.
          </p>
        </div>
      </div>
    </div>
  );
}
