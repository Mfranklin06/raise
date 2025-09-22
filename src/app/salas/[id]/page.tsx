import { SalaCards } from "@/app/components/SalaCards";
import { getUnidadesAC, UnidadeAC } from "@/lib/data";

async function getUnidade(params: { id: string }): Promise<UnidadeAC> {
    const unidades = await getUnidadesAC();
    return unidades[parseInt(params.id) - 1]; // Ajuste simples, mas idealmente buscar por ID
}
interface SalaProps {
    params: {
        id: string;
    };
}

export default async function Sala(u: SalaProps) {
    const unidades = await getUnidade(u.params);
    return <div><SalaCards unidades={unidades}/></div>;
}