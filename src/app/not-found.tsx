"use client";

import Image from "next/image";

export default function NotFound() {
        return (
                <main className="bg-background min-h-screen flex flex-col items-center justify-center">
                        <Image
                                src={"/Macaquinho_IFRano_404.png"}
                                width={1500}
                                height={1500}
                                alt="Imagem de erro 404"
                        />
                </main>

        );
}
