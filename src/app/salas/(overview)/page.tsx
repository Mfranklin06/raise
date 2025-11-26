import { getUnidadesAC, UnidadeAC } from "@/lib/data";
import SalasCards from "../../components/SalasCards";
import { Suspense } from "react";
import { updateEstadoAction } from "../../actions";
import LoadingRooms from "./loading";

async function getUnidades(): Promise<UnidadeAC[]> {
    const unidades = await getUnidadesAC();
    return unidades;
}

export default async function Salas() {
    const unidades = await getUnidades();
    return (
        <Suspense fallback={<LoadingRooms />}>
            <SalasCards unidades={unidades} updateAction={updateEstadoAction} />
        </Suspense>
    );
}