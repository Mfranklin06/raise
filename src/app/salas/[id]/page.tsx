import { updateEstadoAction } from "@/app/actions";
import SalaCards from "@/app/components/SalaCards";
import { getUnidadesAC, UnidadeAC } from "@/lib/data";

async function getUnidade(id: number): Promise<UnidadeAC> {
    const unidades = await getUnidadesAC();
    try {
        const unidade = unidades.find(u => u?.id === id);
        return unidade as UnidadeAC;
    } catch (error) {
        console.error(error);
        throw new Error(`Unidade with id ${id} not found`);
    }
}
interface SalaProps {
    params: {
        id: number;
    };
}

export default async function Sala({ params }: SalaProps) {
    const unidade = await getUnidade(params.id);

    // The component now receives the correctly typed action.
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            {/* --- BACKGROUND TECH --- */}
            {/* Grid Pattern sutil */}
            <div
                className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Vignette (sombra nas bordas) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--background)_100%)] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem] pt-[5rem] relative z-10">
                <SalaCards unidade={unidade} updateAction={updateEstadoAction} />
            </div>
        </main>
    );
}
