"use client";

import React, { useEffect, useState } from "react";
import { InteractiveParameterControl } from "./InteractiveParameters";
import { UnidadeAC } from "@/lib/data";
import { Thermometer, Wind, Zap, Power, Settings, Activity, ArrowLeft, Droplets, Gauge } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMqttControl } from "@/hooks/use-mqtt-control";
import { motion } from "framer-motion";

type PendingChange = Record<string, string | number>;
type PendingChangesMap = Record<string, PendingChange>;
type UpdatingMap = Record<string, boolean>;

export default function SalaCard({
  unidade,
  updateAction,
}: {
  unidade: UnidadeAC;
  updateAction: (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC | UnidadeAC[]>;
}) {
  const [unidadeState, setUnidadeState] = useState<UnidadeAC>(unidade);
  const [pendingChanges, setPendingChanges] = useState<PendingChangesMap>({});
  const [isUpdating, setIsUpdating] = useState<UpdatingMap>({});
  const [error, setError] = useState<string | null>(null);
  const { sendRaw } = useMqttControl();

  useEffect(() => {
    setUnidadeState(unidade);
  }, [unidade]);

  const normalizeUpdated = (updated: UnidadeAC | UnidadeAC[], id: string): UnidadeAC => {
    if (Array.isArray(updated)) {
      const found = updated.find((x) => x.id?.toString() === id.toString());
      return (found ?? (updated.length > 0 ? updated[0] : ({} as UnidadeAC))) as UnidadeAC;
    }
    return updated as UnidadeAC;
  };

  const updateParameter = (unidadeId: string, parameter: string, value: number | string) => {
    setUnidadeState((prev) => ({ ...prev, [parameter]: value } as UnidadeAC));
    const key = parameter.replace(/^current_/, "");
    setPendingChanges((prev) => ({ ...prev, [unidadeId]: { ...prev[unidadeId], [key]: value } }));
  };

  const sendUpdate = async (unidadeId: string) => {
    const changes = pendingChanges[unidadeId];
    if (!changes) return;

    setIsUpdating((p) => ({ ...p, [unidadeId]: true }));
    setError(null);

    try {
      const updatedRaw = await updateAction({ id: unidadeId, updates: changes });
      const updated = normalizeUpdated(updatedRaw, unidadeId);
      setUnidadeState((prev) => ({ ...prev, ...updated }));
      setPendingChanges((prev) => {
        const c = { ...prev };
        delete c[unidadeId];
        return c;
      });
    } catch (err: unknown) {
      console.error("[Client] updateAction error", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsUpdating((p) => ({ ...p, [unidadeId]: false }));
    }
  };

  const sendInitialActivation = async (unidadeId: string) => {
    const initialPayload = {
      temperatura: 22,
      modo: "cool",
      ventilacao: "auto",
    };

    setIsUpdating((p) => ({ ...p, [unidadeId]: true }));
    setError(null);

    try {
      const updatedRaw = await updateAction({ id: unidadeId, updates: initialPayload });
      const updated = normalizeUpdated(updatedRaw, unidadeId);
      setUnidadeState((prev) => ({ ...prev, ...updated }));
    } catch (err: unknown) {
      console.error("[Client] sendInitialActivation error", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsUpdating((p) => ({ ...p, [unidadeId]: false }));
    }
  };

  const u = unidadeState;
  const router = usePathname();
  const linkDinamico = `${router}/adicionar-codigo/`;
  const isUnitInactive = u.current_temperatura === null;
  const hasPendingChanges = !!pendingChanges[u.id];
  const isUpdatingUnit = !!isUpdating[u.id];

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/salas" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para Salas
          </Link>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            {u.name}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isUnitInactive
              ? 'bg-muted text-muted-foreground border-border'
              : 'bg-green-500/10 text-green-500 border-green-500/20'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isUnitInactive ? 'bg-muted-foreground' : 'bg-green-500 animate-pulse'}`} />
              {isUnitInactive ? 'Inativo' : 'Ativo'}
            </div>
          </h1>
          <p className="text-muted-foreground mt-1">Gerenciamento detalhado da unidade</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {isUnitInactive ? (
            <button
              onClick={() => sendInitialActivation(u.id.toString())}
              disabled={isUpdatingUnit}
              className="flex-1 md:flex-none py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isUpdatingUnit ? (
                <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Power className="w-5 h-5" />
              )}
              {isUpdatingUnit ? 'Ativando...' : 'Ativar Unidade'}
            </button>
          ) : (
            <button
              onClick={async () => { await sendUpdate(u.id.toString()); sendRaw(u); }}
              disabled={!hasPendingChanges || isUpdatingUnit}
              className={`flex-1 md:flex-none py-2.5 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${hasPendingChanges
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUpdatingUnit ? (
                <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
              ) : hasPendingChanges ? (
                <Zap className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
              {isUpdatingUnit ? 'Salvando...' : (hasPendingChanges ? 'Salvar Mudanças' : 'Sincronizado')}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Temperatura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Thermometer className="w-5 h-5 text-primary" />
            Temperatura
          </div>
          <div className="space-y-6">
            <div className="text-center p-4 bg-secondary/30 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Temperatura Atual</p>
              <p className="text-4xl font-bold text-foreground tabular-nums">{u.current_temperatura ?? "—"}°C</p>
            </div>
            <InteractiveParameterControl
              label="Ajustar Temperatura"
              value={u.current_temperatura ?? 22}
              unit="°C"
              min={17}
              max={25}
              step={1}
              onChangeAction={(value) => updateParameter(u.id.toString(), "current_temperatura", value)}
              disabled={isUnitInactive}
            />
          </div>
        </motion.div>

        {/* Modo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Settings className="w-5 h-5 text-primary" />
            Modo de Operação
          </div>
          <div className="h-full flex flex-col justify-center">
            <InteractiveParameterControl
              label="Selecione o Modo"
              value={u.current_modo ?? "off"}
              options={[
                { value: "auto", label: "Automático" },
                { value: "cool", label: "Refrigerar" },
                { value: "heat", label: "Aquecer" },
                { value: "off", label: "Desligado" },
              ]}
              onChangeAction={(value) => updateParameter(u.id.toString(), "current_modo", value)}
              disabled={isUnitInactive}
            />
          </div>
        </motion.div>

        {/* Ventilação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Wind className="w-5 h-5 text-primary" />
            Ventilação
          </div>
          <div className="h-full flex flex-col justify-center">
            <InteractiveParameterControl
              label="Velocidade"
              value={u.current_ventilacao ?? "auto"}
              options={[
                { value: "low", label: "Baixa" },
                { value: "medium", label: "Média" },
                { value: "high", label: "Alta" },
                { value: "auto", label: "Automática" },
              ]}
              onChangeAction={(value) => updateParameter(u.id.toString(), "current_ventilacao", value)}
              disabled={isUnitInactive}
            />
          </div>
        </motion.div>

        {/* Umidade (leitura) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Droplets className="w-5 h-5 text-blue-500" />
            Umidade Relativa
          </div>
          <div className="text-center py-8">
            <p className="text-5xl font-bold text-foreground tabular-nums">90<span className="text-2xl text-muted-foreground">%</span></p>
            <p className="text-sm text-muted-foreground mt-2">Nível de umidade atual</p>
          </div>
        </motion.div>

        {/* Consumo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            Consumo Energético
          </div>
          <div className="text-center py-8">
            <p className="text-5xl font-bold text-foreground tabular-nums">9<span className="text-2xl text-muted-foreground">kW/h</span></p>
            <p className="text-sm text-muted-foreground mt-2">Consumo em tempo real</p>
          </div>
        </motion.div>

        {/* Ações rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-foreground">
            <Gauge className="w-5 h-5 text-purple-500" />
            Ações Rápidas
          </div>
          <div className="space-y-3">
            <Link href={linkDinamico} className="block w-full">
              <button className="w-full py-3 px-4 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium flex items-center justify-center gap-2">
                Adicionar Código Raw
              </button>
            </Link>

            <button
              onClick={() => {
                updateParameter(u.id.toString(), "current_modo", "cool");
                updateParameter(u.id.toString(), "current_temperatura", 20);
                updateParameter(u.id.toString(), "current_ventilacao", "high");
              }}
              disabled={u.current_modo === "cool" && u.current_temperatura === 20 && u.current_ventilacao === "high" || isUnitInactive}
              className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Resfriamento Rápido
            </button>

            <button
              onClick={() => {
                updateParameter(u.id.toString(), "current_modo", "off");
              }}
              disabled={u.current_modo === "off" || isUnitInactive}
              className="w-full py-3 px-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Desligar Tudo
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
