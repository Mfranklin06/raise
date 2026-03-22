import SalasCards from "../_components/SalasCards";
import { Suspense } from "react";
import { updateEstadoAction } from "../../actions";
import LoadingRooms from "./loading";
import GetSalas from "./actions";

export default async function Salas() {
    const unidades = await GetSalas();
    return (
        <Suspense fallback={<LoadingRooms />}>
            <main className="min-h-screen p-20 bg-background relative overflow-hidden">

                <SalasCards unidades={unidades} updateAction={updateEstadoAction} />
            </main>
        </Suspense>
    );
}