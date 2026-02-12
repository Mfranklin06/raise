"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
        return (
                <main className="bg-background min-h-screen flex flex-col items-center justify-center">
                        <Image 
                                src={"Macaquinho IFRano 404.png"}
                                width={400}
                                height={400}
                                alt="Imagem de erro 404"
                        />
                </main>

        );
}
