"use client";

import React, { useEffect, useState } from "react";
import { InteractiveParameterControl } from "./InteractiveParameters";
import { Card, CardContent, CardHeader } from "@mui/material";
import { UnidadeAC } from "@/lib/data";
import { BoltIcon, ChartBarIcon, CogIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
//import { Poppins } from "next/font/google";

//const poppins = Poppins({ weight: ["400"], subsets: ["latin"] });

type PendingChange = Record<string, string | number>;
type PendingChangesMap = Record<string, PendingChange>;
type UpdatingMap = Record<string, boolean>;

/**
 * Componente que renderiza UMA unidade.
 * Se sua action retornar UnidadeAC[] (array), o código normaliza e pega a unidade correta.
 */
export default function SalaCard({
  unidade,
  updateAction,
}: {
  unidade: UnidadeAC;
  // Permite que a action retorne um objeto ou um array (compatibilidade)
  updateAction: (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC | UnidadeAC[]>;
}) {
  const [unidadeState, setUnidadeState] = useState<UnidadeAC>(unidade);
  const [pendingChanges, setPendingChanges] = useState<PendingChangesMap>({});
  const [isUpdating, setIsUpdating] = useState<UpdatingMap>({});
  const [error, setError] = useState<string | null>(null);

  // Sincroniza quando a prop unidade muda
  useEffect(() => {
    setUnidadeState(unidade);
  }, [unidade]);

  const normalizeUpdated = (updated: UnidadeAC | UnidadeAC[], id: string): UnidadeAC => {
    if (Array.isArray(updated)) {
      // tenta encontrar pelo id, senão pega o primeiro
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Controles de Parâmetros — {u.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Temperatura */}
        <Card className="room-card">
          <CardHeader
            sx={{
              "& .MuiCardHeader-title": { color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 600 },
              "& .MuiCardHeader-content": { fontSize: "0.875rem", color: "var(--card-foreground)" },
            }}
          >
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-primary" />
              Temperatura
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Atual</p>
                <p className="text-2xl font-bold text-foreground">{u.current_temperatura ?? "—"}°C</p>
              </div>
              <InteractiveParameterControl
                label="Temperatura Desejada"
                value={u.current_temperatura ?? 22}
                unit="°C"
                min={17}
                max={25}
                step={1}
                onChangeAction={(value) => updateParameter(u.id.toString(), "current_temperatura", value)}
                disabled={u.current_status === "desligado"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modo */}
        <Card className="room-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CogIcon className="w-5 h-5 text-primary" />
              Modo de Operação
            </div>
          </CardHeader>
          <CardContent>
            <InteractiveParameterControl
              label="Modo"
              value={u.current_modo ?? "off"}
              options={[
                { value: "auto", label: "Automático" },
                { value: "cool", label: "Refrigerar" },
                { value: "heat", label: "Aquecer" },
                { value: "off", label: "Desligado" },
              ]}
              onChangeAction={(value) => updateParameter(u.id.toString(), "current_modo", value)}
              disabled={u.current_status === "desligado"}
            />
          </CardContent>
        </Card>

        {/* Ventilação */}
        <Card className="room-card">
          <CardHeader
            sx={{
              "& .MuiCardHeader-title": { color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 600 },
              "& .MuiCardHeader-content": { fontSize: "0.875rem", color: "var(--card-foreground)" },
            }}
          >
            <div className="flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5" />
              Ventilação
            </div>
          </CardHeader>
          <CardContent>
            <InteractiveParameterControl
              label="Ventilação"
              value={u.current_ventilacao ?? "auto"}
              options={[
                { value: "low", label: "Baixa" },
                { value: "medium", label: "Média" },
                { value: "high", label: "Alta" },
                { value: "auto", label: "Automática" },
              ]}
              onChangeAction={(value) => updateParameter(u.id.toString(), "current_ventilacao", value)}
              disabled={u.current_status === "desligado"}
            />
          </CardContent>
        </Card>

        {/* Umidade (leitura) */}
        <Card className="room-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5" />
              Umidade
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">90%</p>{/*u.humidity ?? "—"*/}
              <p className="text-sm text-muted-foreground">Somente leitura</p>
            </div>
          </CardContent>
        </Card>

        {/* Consumo */}
        <Card className="room-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BoltIcon className="w-5 h-5" />
              Consumo
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">9</p>{/*u.powerConsumption ?? "—"*/}
              <p className="text-sm text-muted-foreground">kW/h</p>
            </div>
          </CardContent>
        </Card>

        {/* Ações rápidas */}
        <Card className="room-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5" />
              Ações Rápidas
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => {
                updateParameter(u.id.toString(), "current_modo", "auto");
                updateParameter(u.id.toString(), "current_temperatura", 22);
                updateParameter(u.id.toString(), "current_ventilacao", "medium");
              }}
              disabled={u.current_modo === "auto" && u.current_temperatura === 22 && u.current_ventilacao === "medium"}
              className="w-full p-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Modo Eco
            </button>

            <button
              onClick={() => {
                updateParameter(u.id.toString(), "current_modo", "cool");
                updateParameter(u.id.toString(), "current_temperatura", 20);
                updateParameter(u.id.toString(), "current_ventilacao", "high");
              }}
              disabled={u.current_modo === "cool" && u.current_temperatura === 20 && u.current_ventilacao === "high"}
              className="w-full p-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Resfriamento Rápido
            </button>

            <button
              onClick={() => {
                updateParameter(u.id.toString(), "current_modo", "off");
              }}
              disabled={u.current_modo === "off"}
              className="w-full p-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Desligar Tudo
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Botões de ação — salvar / ativar */}
      <div className="flex gap-2">
        <button onClick={() => sendUpdate(u.id.toString())} className="btn">
          {isUpdating[u.id.toString()] ? "Salvando..." : "Salvar mudanças"}
        </button>

        <button onClick={() => sendInitialActivation(u.id.toString())} className="btn-outline">
          {isUpdating[u.id.toString()] ? "Aguardando..." : "Ativar Unidade"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
