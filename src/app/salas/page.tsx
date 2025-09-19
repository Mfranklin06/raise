import { getUnidadesAC, UnidadeAC } from "@/lib/data";
import Header from "../components/Header";
import SalasCards from "../components/SalasCards";
import { Suspense } from "react";

function LoadingRooms() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/20 h-80 rounded-lg" aria-label="Loading room data">
                    <div className="h-full flex items-center justify-center">
                        <div className="text-muted-foreground">Carregando sala...</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

async function getUnidades(): Promise<UnidadeAC[]> {
    const unidades = await getUnidadesAC();
    return unidades;
}


export default async function Salas() {
    const unidades = await getUnidades();
    return (
        <main className="min-h-screen bg-background">
            <header>
                <Header />
            </header>
            <Suspense fallback={<LoadingRooms />}>
                <SalasCards unidades={unidades} />
            </Suspense>
        </main>
    );
}