import { updateEstadoAction } from "@/app/actions";
import SalaCards from "@/app/salas/[id]/components/SalaCards";
import getSalaById from "./actions";

import { Suspense } from 'react';

async function SalaContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [unidade] = await getSalaById(id);

    return (
            <main className="min-h-screen bg-background relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.2] pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem] pt-[5rem] relative z-10">
                    <SalaCards unidade={unidade} updateAction={updateEstadoAction} />
                </div>
            </main>
    );

}

export default async function Sala({ params }: { params: Promise<{ id: string }> }) {

    return(
        <Suspense fallback={<div>Loading...</div>}>
            <SalaContent params={params} />
        </Suspense>
    );

}
