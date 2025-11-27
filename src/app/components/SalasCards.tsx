'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Thermometer, Wind, Zap, Power, ArrowRight, Activity } from 'lucide-react';
import { InteractiveParameterControl } from './InteractiveParameters';
import type { UnidadeAC } from '@/lib/data';
import { MqttEnvioDeJson } from './MqttConection';

type PendingChange = Record<string, string | number>;
type PendingChangesMap = Record<string, PendingChange>;
type UpdatingMap = Record<string, boolean>;

export default function SalasCards({
  unidades,
  updateAction,
}: {
  unidades: UnidadeAC[];
  updateAction: (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC>;
}) {
  const [unidadeState, setUnidadeState] = useState<UnidadeAC[]>(unidades);
  const [pendingChanges, setPendingChanges] = useState<PendingChangesMap>({});
  const [isUpdating, setIsUpdating] = useState<UpdatingMap>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const updateParameter = (unidadeId: string, parameter: string, value: number | string) => {
    setUnidadeState((prev) =>
      prev.map((u) => (u.id.toString() === unidadeId ? { ...u, [parameter]: value } : u))
    );
    const key = parameter.replace(/^current_/, '');
    setPendingChanges((prev) => ({ ...prev, [unidadeId]: { ...prev[unidadeId], [key]: value } }));
  };

  const sendUpdate = async (unidadeId: string) => {
    const changes = pendingChanges[unidadeId];
    if (!changes) return;

    setIsUpdating((p) => ({ ...p, [unidadeId]: true }));
    setErrorMap((p) => ({ ...p, [unidadeId]: null }));

    try {
      const updated = await updateAction({ id: unidadeId, updates: changes });
      setUnidadeState((prev) => prev.map((u) => (u.id.toString() === unidadeId ? { ...u, ...updated } : u)));
      setPendingChanges((prev) => { const c = { ...prev }; delete c[unidadeId]; return c; });
    } catch (err: unknown) {
      console.error('[Client] updateAction error', err);
      setErrorMap((p) => ({ ...p, [unidadeId]: err instanceof Error ? err.message : 'Erro desconhecido' }));
    } finally {
      setIsUpdating((p) => ({ ...p, [unidadeId]: false }));
    }
  };

  const sendInitialActivation = async (unidadeId: string) => {
    const initialPayload = {
      temperatura: 22,
      modo: 'cool',
      ventilacao: 'high',
    };

    setIsUpdating((p) => ({ ...p, [unidadeId]: true }));
    setErrorMap((p) => ({ ...p, [unidadeId]: null }));

    try {
      const updated = await updateAction({ id: unidadeId, updates: initialPayload });
      setUnidadeState((prev) => prev.map((u) => (u.id.toString() === unidadeId ? { ...u, ...updated } : u)));
    } catch (err: unknown) {
      console.error('[Client] sendInitialActivation error', err);
      setErrorMap((p) => ({ ...p, [unidadeId]: err instanceof Error ? err.message : 'Erro desconhecido' }));
    } finally {
      setIsUpdating((p) => ({ ...p, [unidadeId]: false }));
    }
  };

  const filteredUnidades = unidadeState.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Controle de Salas
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie a climatização de todas as unidades</p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar sala..."
            className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUnidades.map((u) => {
            const isUnitInactive = u.current_temperatura === null;
            const hasPendingChanges = !!pendingChanges[u.id];
            const isUpdatingUnit = !!isUpdating[u.id];

            return (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-card/70 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-border/50 bg-secondary/30">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground">{u.name}</h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isUnitInactive
                      ? 'bg-muted text-muted-foreground border-border'
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isUnitInactive ? 'bg-muted-foreground' : 'bg-green-500 animate-pulse'}`} />
                      {isUnitInactive ? 'Inativo' : 'Ativo'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    <span>
                      Atualizado: {u.last_updated_at
                        ? new Date(u.last_updated_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                  <InteractiveParameterControl
                    label="Temperatura"
                    value={u.current_temperatura}
                    unit="°C"
                    min={17}
                    max={25}
                    step={1}
                    onChangeAction={(value) => updateParameter(u.id.toString(), 'current_temperatura', value)}
                    disabled={isUnitInactive}
                    icon={Thermometer}
                  />

                  <InteractiveParameterControl
                    label="Modo"
                    value={u.current_modo ?? 'desligado'}
                    options={[
                      { value: 'auto', label: 'Automático' },
                      { value: 'cool', label: 'Refrigerar' },
                      { value: 'heat', label: 'Aquecer' },
                      { value: 'desligado', label: 'Desligado' },
                    ]}
                    onChangeAction={(value) => updateParameter(u.id.toString(), 'current_modo', value)}
                    disabled={isUnitInactive}
                    icon={Zap}
                  />

                  <InteractiveParameterControl
                    label="Ventilação"
                    value={u.current_ventilacao ?? 'auto'}
                    options={[
                      { value: 'low', label: 'Baixa' },
                      { value: 'medium', label: 'Média' },
                      { value: 'high', label: 'Alta' },
                      { value: 'auto', label: 'Automática' },
                    ]}
                    onChangeAction={(value) => updateParameter(u.id.toString(), 'current_ventilacao', value)}
                    disabled={isUnitInactive}
                    icon={Wind}
                  />

                  {errorMap[u.id] && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                      {errorMap[u.id]}
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    {isUnitInactive ? (
                      <button
                        onClick={() => sendInitialActivation(u.id.toString())}
                        disabled={isUpdatingUnit}
                        className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        {isUpdatingUnit ? (
                          <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Power className="w-5 h-5" />
                        )}
                        {isUpdatingUnit ? 'Ativando...' : 'Ativar Sistema'}
                      </button>
                    ) : (
                      <button
                        onClick={async () => { await sendUpdate(u.id.toString()); await MqttEnvioDeJson(u.id.toString()); }}
                        disabled={!hasPendingChanges || isUpdatingUnit}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${hasPendingChanges
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isUpdatingUnit ? (
                          <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                        ) : hasPendingChanges ? (
                          <Zap className="w-5 h-5" />
                        ) : (
                          <Activity className="w-5 h-5" />
                        )}
                        {isUpdatingUnit ? 'Atualizando...' : (hasPendingChanges ? 'Aplicar Mudanças' : 'Sincronizado')}
                      </button>
                    )}

                    <Link
                      href={`/salas/${u.id}/`}
                      className="block w-full"
                    >
                      <button className="w-full py-2.5 px-4 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium group-hover:border-primary/30">
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUnidades.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p className="text-lg">Nenhuma sala encontrada com &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>
    </section>
  );
}