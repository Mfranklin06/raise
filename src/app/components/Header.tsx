"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function Header() {
  const [open, setOpen] = useState(false); 

  return (
    <>
      {/* HEADER: fixed, altura fixa, z acima do painel */}
      <div className="fixed inset-x-0 top-0 z-50 h-[4rem] backdrop-blur-sm bg-background/30 border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="group flex items-center gap-4">
            <Link href="/" className="flex flex-col items-center gap-1.5">
              <span className="text-lg font-extrabold text-foreground group-hover:text-primary">RAISE</span>
              <span className="hidden sm:block h-1 w-20 bg-foreground/85 rounded group-hover:bg-primary" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#home" className="text-sm text-foreground hover:opacity-90 hover:text-primary">Início</Link>
            <Link href="/#features" className="text-sm text-foreground hover:opacity-90 hover:text-primary">Recursos</Link>
            <Link href="/#about" className="text-sm text-foreground hover:opacity-90 hover:text-primary">Sobre</Link>
            <Link href="/salas" className="text-sm text-foreground hover:opacity-90 hover:text-primary">Salas</Link>
            <Link href="/portas/#inicial" className="text-sm text-foreground hover:opacity-90 hover:text-primary">Portas</Link>
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Abrir menu"
              className="ml-3 inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-background transition"
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL: fora do header (irmão). top = header height (4rem) */}
      <div
        className={`md:hidden fixed left-0 right-0 z-40 transform transition-all duration-300
        ${open ? "translate-y-0 opacity-100 visible pointer-events-auto" : "-translate-y-full opacity-0 invisible pointer-events-none"}`}
        style={{ top: "4rem" }}
        aria-hidden={!open}
        role="dialog"
      >
        {/* Use um fundo translúcido suave em vez de preto opaco */}
        <div className="backdrop-blur-sm bg-background border-t px-6 py-6 shadow-lg max-h-[calc(100vh-4rem)] overflow-auto">
          <div className="flex flex-col gap-4">
            <Link href="/#home" onClick={() => setOpen(false)} className="py-2 text-lg text-foreground">Início</Link>
            <Link href="/#features" onClick={() => setOpen(false)} className="py-2 text-lg text-foreground">Recursos</Link>
            <Link href="/#about" onClick={() => setOpen(false)} className="py-2 text-lg text-foreground">Sobre</Link>
            <Link href="/salas" onClick={() => setOpen(false)} className="py-2 text-lg text-foreground">Salas</Link>
            <Link href="/portas" onClick={() => setOpen(false)} className="py-2 text-lg text-foreground">Portas</Link>
          </div>
        </div>
      </div>
    </>
  );
}
