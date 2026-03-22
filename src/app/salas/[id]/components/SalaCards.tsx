'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InteractiveParameterControl } from '../../_components/InteractiveParameters';
import { useMqttControl } from '@/hooks/use-mqtt-control';
import type { UnidadeAC } from '@/lib/data';
import { BsActivity, BsArrowLeft, BsLightningCharge, BsThermometer } from 'react-icons/bs';
import { CiPower, CiSettings } from 'react-icons/ci';
import { WiStrongWind } from 'react-icons/wi';
import { LuGauge } from 'react-icons/lu';

type UpdateAction = (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC | UnidadeAC[]>;


/** A updateAction pode retornar array ou objeto — normaliza para um único UnidadeAC */
function extractUnit(result: UnidadeAC | UnidadeAC[], id: string): UnidadeAC {
        if (!Array.isArray(result)) return result;
        return result.find(x => x.id?.toString() === id) ?? result[0];
}

function StatusBadge({ active }: { active: boolean }) {
        return (
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${active
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                        {active ? 'Ativo' : 'Inativo'}
                </span>
        );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
        return (
                <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
                                {icon}
                                {title}
                        </div>
                        {children}
                </div>
        );
}

export default function SalaCard({ unidade: initial, updateAction }: { unidade: UnidadeAC; updateAction: UpdateAction }) {
        const [unit, setUnit] = useState(initial);
        const [pending, setPending] = useState<Record<string, string | number>>({});
        const [isUpdating, setIsUpdating] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const { sendRaw } = useMqttControl();
        const pathname = usePathname();

        const id = unit.id.toString();
        const isInactive = unit.current_temperatura === null;
        const hasPending = Object.keys(pending).length > 0;

        function change(field: string, value: string | number) {
                setUnit(prev => ({ ...prev, [field]: value }));
                setPending(prev => ({ ...prev, [field.replace(/^current_/, '')]: value }));
        }

        async function runUpdate(updates: Record<string, unknown>) {
                setIsUpdating(true);
                setError(null);
                try {
                        const result = await updateAction({ id, updates });
                        const updated = extractUnit(result, id);
                        setUnit(prev => ({ ...prev, ...updated }));
                        setPending({});
                        return updated;
                } catch (err) {
                        setError(err instanceof Error ? err.message : 'Erro desconhecido');
                } finally {
                        setIsUpdating(false);
                }
        }

        async function applyChanges() {
                const updated = await runUpdate(pending);
                if (updated) sendRaw(updated);
        }

        async function activate() {
                await runUpdate({ temperatura: 22, modo: 'cool', ventilacao: 'auto' });
        }

        return (
                <div className="space-y-8">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                        <Link href="/salas" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors mb-2 text-sm">
                                                <BsArrowLeft className="w-4 h-4" />
                                                Voltar para Salas
                                        </Link>
                                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                                {unit.name}
                                                <StatusBadge active={!isInactive} />
                                        </h1>
                                        <p className="text-muted-foreground mt-1">Gerenciamento detalhado da unidade</p>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                        {isInactive ? (
                                                <button
                                                        onClick={activate}
                                                        disabled={isUpdating}
                                                        className="flex-1 md:flex-none py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                                >
                                                        {isUpdating
                                                                ? <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                                                : <CiPower className="w-5 h-5" />}
                                                        {isUpdating ? 'Ativando...' : 'Ativar Unidade'}
                                                </button>
                                        ) : (
                                                <button
                                                        onClick={applyChanges}
                                                        disabled={!hasPending || isUpdating}
                                                        className={`flex-1 md:flex-none py-2.5 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${hasPending
                                                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                                                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                                                                }`}
                                                >
                                                        {isUpdating
                                                                ? <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                                                : hasPending ? <BsLightningCharge className="w-5 h-5" /> : <BsActivity className="w-5 h-5" />}
                                                        {isUpdating ? 'Salvando...' : hasPending ? 'Salvar Mudanças' : 'Sincronizado'}
                                                </button>
                                        )}
                                </div>
                        </div>

                        {error && (
                                <p className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                                        <BsActivity className="w-5 h-5 shrink-0" />
                                        {error}
                                </p>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                <InfoCard icon={<BsThermometer className="w-5 h-5 text-primary" />} title="Temperatura">
                                        <div className="space-y-6">
                                                <div className="text-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                                                        <p className="text-sm text-muted-foreground mb-1">Temperatura Atual</p>
                                                        <p className="text-4xl font-bold text-foreground tabular-nums">{unit.current_temperatura ?? '—'}°C</p>
                                                </div>
                                                <InteractiveParameterControl
                                                        label="Ajustar Temperatura" unit="°C" min={17} max={25} step={1}
                                                        value={unit.current_temperatura ?? 22}
                                                        onChangeAction={(v) => change('current_temperatura', v)}
                                                        disabled={isInactive}
                                                />
                                        </div>
                                </InfoCard>

                                <InfoCard icon={<CiSettings className="w-5 h-5 text-primary" />} title="Modo de Operação">
                                        <InteractiveParameterControl
                                                label="Selecione o Modo"
                                                value={unit.current_modo ?? 'off'}
                                                options={[
                                                        { value: 'auto', label: 'Automático' },
                                                        { value: 'cool', label: 'Refrigerar' },
                                                        { value: 'heat', label: 'Aquecer' },
                                                        { value: 'off',  label: 'Desligado' },
                                                ]}
                                                onChangeAction={(v) => change('current_modo', v)}
                                                disabled={isInactive}
                                        />
                                </InfoCard>

                                <InfoCard icon={<WiStrongWind className="w-5 h-5 text-primary" />} title="Ventilação">
                                        <InteractiveParameterControl
                                                label="Velocidade"
                                                value={unit.current_ventilacao ?? 'auto'}
                                                options={[
                                                        { value: 'low',    label: 'Baixa' },
                                                        { value: 'medium', label: 'Média' },
                                                        { value: 'high',   label: 'Alta' },
                                                        { value: 'auto',   label: 'Automática' },
                                                ]}
                                                onChangeAction={(v) => change('current_ventilacao', v)}
                                                disabled={isInactive}
                                        />
                                </InfoCard>

                                <InfoCard icon={<BsLightningCharge className="w-5 h-5" />} title="Consumo Energético">
                                        <div className="text-center py-8">
                                                <p className="text-5xl font-bold text-foreground tabular-nums">
                                                        9<span className="text-2xl text-muted-foreground">kW/h</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2">Consumo em tempo real</p>
                                        </div>
                                </InfoCard>

                                <div className="bg-card/70 backdrop-blur-md border rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-muted-foreground">
                                                <LuGauge className="w-5 h-5" />
                                                Ações Rápidas
                                        </div>
                                        <div className="space-y-3">
                                                <Link href={`${pathname}/adicionar-codigo/`} className="block">
                                                        <button className="w-full py-3 px-4 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium">
                                                                Adicionar Código Raw
                                                        </button>
                                                </Link>
                                                <button
                                                        onClick={() => {
                                                                change('current_modo', 'cool');
                                                                change('current_temperatura', 22);
                                                                change('current_ventilacao', 'high');
                                                        }}
                                                        disabled={isInactive || (unit.current_modo === 'cool' && unit.current_temperatura === 22 && unit.current_ventilacao === 'high')}
                                                        className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                                >
                                                        Resfriamento Rápido
                                                </button>
                                                <button
                                                        onClick={() => change('current_modo', 'off')}
                                                        disabled={isInactive || unit.current_modo === 'off'}
                                                        className="w-full py-3 px-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                                >
                                                        Desligar Tudo
                                                </button>
                                        </div>
                                </div>

                        </div>
                </div>
        );
}