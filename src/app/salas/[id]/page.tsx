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
        <div>
            <SalaCards unidade={unidades} updateAction={updateEstadoAction}/>
        </div>
    );
}
