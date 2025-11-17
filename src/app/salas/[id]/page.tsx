import { updateEstadoAction } from "@/app/actions";
import SalaCards from "@/app/components/SalaCards";
import { getUnidadesAC, UnidadeAC } from "@/lib/data";

async function getUnidade(id: string): Promise<UnidadeAC> {
    const unidades = await getUnidadesAC();
    const unidade = unidades.find(u => u?.id === parseInt(id));
    if (!unidade) throw new Error(`Unidade with id ${id} not found`);
    return unidade;
}
interface SalaProps {
    params: {
        id: string;
    };
}

export default async function Sala({params}: SalaProps) {
    const unidades = await getUnidade(params.id);

    // The component now receives the correctly typed action.
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem] pt-[5rem]">
                <SalaCards unidade={unidades} updateAction={updateEstadoAction} />
            </div>
        </main>
    );
}
