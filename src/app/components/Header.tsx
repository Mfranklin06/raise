"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        <Link href={"/"}>RAISE</Link>
        <nav>
          <Link href={"/inicio"}>Inicio</Link>
          <Link href={"#recursos"}>Recursos</Link>
          <Link href={"#sobre"}>Sobre</Link>
          <Link href={"/salas"}>Salas</Link>
        </nav>
      </div>
    </header>
  );
}