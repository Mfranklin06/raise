'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InteractiveParameterControl } from './InteractiveParameters';
import type { UnidadeAC } from '@/lib/data';
import { useMqttControl } from '@/hooks/use-mqtt-control';
import { BsActivity, BsArrowRight, BsLightningCharge, BsThermometer } from 'react-icons/bs';
import { WiStrongWind } from 'react-icons/wi';
import { CiPower } from 'react-icons/ci';
import { IoSettingsOutline } from 'react-icons/io5';

type UpdateAction = (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC>;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
        return (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${active
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                        {active ? 'Ativo' : 'Inativo'}
                </div>
        );
}

function ActionButton({
        onClick,
        loading,
        disabled = false,
        icon,
        loadingLabel,
        label,
        primary = true,
}: {
        onClick: () => void;
        loading: boolean;
        disabled?: boolean;
        icon: React.ReactNode;
        loadingLabel: string;
        label: string;
        primary?: boolean;
}) {
        return (
                <button
                        onClick={onClick}
                        disabled={disabled || loading}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${primary
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                >
                        {loading
                                ? <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                : icon}
                        {loading ? loadingLabel : label}
                </button>
        );
}


export function Card({ unidade: initial, updateAction }: { unidade: UnidadeAC; updateAction: UpdateAction }) {
        const [unidade, setUnidade] = useState(initial);
        const [pending, setPending] = useState<Record<string, string | number>>({});
        const [isUpdating, setIsUpdating] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const { sendRaw } = useMqttControl();

        const isInactive = unidade.current_temperatura === null;
        const hasPending = Object.keys(pending).length > 0;

        function onChange(field: string, value: string | number) {
                setUnidade(prev => ({ ...prev, [field]: value }));
                setPending(prev => ({ ...prev, [field.replace(/^current_/, '')]: value }));
        }

        async function applyChanges() {
                setIsUpdating(true);
                setError(null);
                try {
                        const updated = await updateAction({ id: unidade.id.toString(), updates: pending });
                        setUnidade(updated);
                        setPending({});
                        sendRaw(updated);
                } catch (err) {
                        setError(err instanceof Error ? err.message : 'Erro desconhecido');
                } finally {
                        setIsUpdating(false);
                }
        }

        async function activate() {
                setIsUpdating(true);
                setError(null);
                try {
                        const updated = await updateAction({
                                id: unidade.id.toString(),
                                updates: { temperatura: 22, modo: 'cool', ventilacao: 'high' },
                        });
                        setUnidade(updated);
                } catch (err) {
                        setError(err instanceof Error ? err.message : 'Erro desconhecido');
                } finally {
                        setIsUpdating(false);
                }
        }

        return (
                <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">

                        {/* Header */}
                        <div className="p-6 border-b border-border/50 bg-secondary/30">
                                <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-foreground">{unidade.name}</h3>
                                        <StatusBadge active={!isInactive} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                        Atualizado:{' '}
                                        {unidade.last_updated_at
                                                ? new Date(unidade.last_updated_at).toLocaleString('pt-BR', {
                                                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                                                })
                                                : 'N/A'}
                                </p>
                        </div>

                        {/* Controls */}
                        <div className="p-6 space-y-6">
                                <InteractiveParameterControl
                                        label="Temperatura" unit="°C" min={17} max={25} step={1}
                                        value={unidade.current_temperatura}
                                        onChangeAction={(v) => onChange('current_temperatura', v)}
                                        disabled={isInactive}
                                        icon={BsThermometer}
                                />
                                <InteractiveParameterControl
                                        label="Modo"
                                        value={unidade.current_modo ?? 'desligado'}
                                        options={[
                                                { value: 'auto', label: 'Automático' },
                                                { value: 'cool', label: 'Refrigerar' },
                                                { value: 'heat', label: 'Aquecer' },
                                                { value: 'desligado', label: 'Desligado' },
                                        ]}
                                        onChangeAction={(v) => onChange('current_modo', v)}
                                        disabled={isInactive}
                                        icon={IoSettingsOutline}
                                />
                                <InteractiveParameterControl
                                        label="Ventilação"
                                        value={unidade.current_ventilacao ?? 'auto'}
                                        options={[
                                                { value: 'low', label: 'Baixa' },
                                                { value: 'medium', label: 'Média' },
                                                { value: 'high', label: 'Alta' },
                                                { value: 'auto', label: 'Automática' },
                                        ]}
                                        onChangeAction={(v) => onChange('current_ventilacao', v)}
                                        disabled={isInactive}
                                        icon={WiStrongWind}
                                />

                                {error && (
                                        <p className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                                {error}
                                        </p>
                                )}

                                <div className="pt-2 space-y-3">
                                        {isInactive ? (
                                                <ActionButton
                                                        onClick={activate} loading={isUpdating}
                                                        icon={<CiPower className="w-5 h-5" />}
                                                        label="Ativar Sistema" loadingLabel="Ativando..."
                                                />
                                        ) : (
                                                <ActionButton
                                                        onClick={applyChanges} loading={isUpdating} disabled={!hasPending}
                                                        icon={hasPending
                                                                ? <BsLightningCharge className="w-5 h-5" />
                                                                : <BsActivity className="w-5 h-5" />}
                                                        label={hasPending ? 'Aplicar Mudanças' : 'Sincronizado'}
                                                        loadingLabel="Atualizando..."
                                                        primary={hasPending}
                                                />
                                        )}

                                        <Link href={`/salas/${unidade.id}/`} className="block w-full">
                                                <button className="w-full py-2.5 px-4 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium group-hover:border-primary/30">
                                                        Ver Detalhes <BsArrowRight className="w-4 h-4" />
                                                </button>
                                        </Link>
                                </div>
                        </div>
                </div>
        );
}