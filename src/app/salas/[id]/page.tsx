import { updateEstadoAction } from "@/app/actions";
import SalaCards from "@/app/components/SalaCards";
import { getUnidadesAC, UnidadeAC } from "@/lib/data";

async function getUnidade(params: { id: string }): Promise<UnidadeAC> {
    // This function fetches all units. For a real-world scenario,
    // you might filter by the ID from params if needed.
    const unidades = await getUnidadesAC();
    return unidades.find(u => u.id === parseInt(params.id))!;
}
interface SalaProps {
    params: {
        id: string;
    };
}

export default async function Sala(u: SalaProps) {
    const unidades = await getUnidade(u.params);

    // The component now receives the correctly typed action.
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem]">
                <SalaCards unidade={unidades} updateAction={updateEstadoAction} />
            </div>
        </main>
    );
}
