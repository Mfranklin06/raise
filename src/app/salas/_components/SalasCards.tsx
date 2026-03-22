'use client';

import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { BsLightningCharge } from 'react-icons/bs';
import type { UnidadeAC } from '@/lib/data';
import { Card } from './Card';

type UpdateAction = (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC>;

export default function SalasCards({ unidades, updateAction }: { unidades: UnidadeAC[]; updateAction: UpdateAction }) {
        const [search, setSearch] = useState('');

        const filtered = unidades.filter(u =>
                u.name.toLowerCase().includes(search.toLowerCase())
        );

        return (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-[5rem] relative z-10">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                                <div>
                                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                                <BsLightningCharge className="w-8 h-8 text-primary" />
                                                Controle de Salas
                                        </h1>
                                        <p className="text-muted-foreground mt-1">Gerencie a climatização de todas as unidades</p>
                                </div>

                                <div className="relative w-full md:w-96">
                                        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                                        <input
                                                type="text"
                                                placeholder="Buscar sala..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        />
                                </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map(u => (
                                        <Card key={u.id} unidade={u} updateAction={updateAction} />
                                ))}

                                {filtered.length === 0 && (
                                        <p className="col-span-full py-12 text-center text-muted-foreground text-lg">
                                                Nenhuma sala encontrada com &quot;{search}&quot;
                                        </p>
                                )}
                        </div>
                </section>
        );
}