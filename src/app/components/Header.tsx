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
      <header className="fixed inset-x-0 top-0 z-50 h-16 backdrop-blur-sm bg-white/30 dark:bg-black/30 border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col items-center gap-1.5 hover:text-green-700">
              <span className="text-lg font-extrabold text-gray-900 dark:text-white hover:text-green-700">RAISE</span>
              <span className="hidden sm:block h-1 w-20 bg-white/90 dark:bg-white/80 rounded " />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#home" className="text-sm text-gray-700 dark:text-gray-200 hover:opacity-90 hover:text-green-700">Início</Link>
            <Link href="/#features" className="text-sm text-gray-700 dark:text-gray-200 hover:opacity-90 hover:text-green-700">Recursos</Link>
            <Link href="/#about" className="text-sm text-gray-700 dark:text-gray-200 hover:opacity-90 hover:text-green-700">Sobre</Link>
            <Link href="/salas" className="text-sm text-gray-700 dark:text-gray-200 hover:opacity-90 hover:text-green-700">Salas</Link>
            <Link href="/relatorios" className="text-sm text-gray-700 dark:text-gray-200 hover:opacity-90 hover:text-green-700">Relatórios</Link>
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Abrir menu"
              className="ml-3 inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE PANEL: fora do header (irmão). top = header height (4rem) */}
      <div
        className={`md:hidden fixed left-0 right-0 z-40 transform transition-all duration-300
        ${open ? "translate-y-0 opacity-100 visible pointer-events-auto" : "-translate-y-full opacity-0 invisible pointer-events-none"}`}
        style={{ top: "4rem" }}
        aria-hidden={!open}
        role="dialog"
      >
        {/* Use um fundo translúcido suave em vez de preto opaco */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-black/50 border-t px-6 py-6 shadow-lg max-h-[calc(100vh-4rem)] overflow-auto">
          <div className="flex flex-col gap-4">
            <a href="#home" onClick={() => setOpen(false)} className="py-2 text-lg text-gray-800 dark:text-white">Início</a>
            <a href="#features" onClick={() => setOpen(false)} className="py-2 text-lg text-gray-800 dark:text-white">Recursos</a>
            <a href="#about" onClick={() => setOpen(false)} className="py-2 text-lg text-gray-800 dark:text-white">Sobre</a>
            <Link href="/salas" onClick={() => setOpen(false)} className="py-2 text-lg text-gray-800 dark:text-white">Salas</Link>
            <Link href="/relatorios" onClick={() => setOpen(false)} className="py-2 text-lg text-gray-800 dark:text-white">Relatórios</Link>
          </div>
        </div>
      </div>
    </>
  );
}
