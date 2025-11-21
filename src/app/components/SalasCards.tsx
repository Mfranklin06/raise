// app/salas/components/SalasCards.tsx
'use client';

import React, { useState } from 'react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader } from '@mui/material';
import { InteractiveParameterControl } from './InteractiveParameters';
import type { UnidadeAC } from '@/lib/data';
import { MqttEnvioDeJson } from './MqttConection';

const poppins = Poppins({ weight: ['400'], subsets: ['latin'] });

type PendingChange = Record<string, string | number>;
type PendingChangesMap = Record<string, PendingChange>;
type UpdatingMap = Record<string, boolean>;

export default function SalasCards({
  unidades,
  updateAction, // a Server Action passada como prop
}: {
  unidades: UnidadeAC[];
  updateAction: (payload: { id: string; updates: Record<string, unknown> }) => Promise<UnidadeAC>;
}) {
  const [unidadeState, setUnidadeState] = useState<UnidadeAC[]>(unidades);
  const [pendingChanges, setPendingChanges] = useState<PendingChangesMap>({});
  const [isUpdating, setIsUpdating] = useState<UpdatingMap>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

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

  // --- NOVA FUNÇÃO ---
  // Função dedicada para ativar uma unidade que está desligada (temp nula)
  const sendInitialActivation = async (unidadeId: string) => {
    // Payload padrão: Temperatura 22°C (valor default do slider) e modo Refrigerar
    const initialPayload = {
      temperatura: 22,
      modo: 'cool', // 'cool' corresponde a "Refrigerar"
      ventilacao: 'auto', // Pode definir um valor padrão para ventilação também
    };

    setIsUpdating((p) => ({ ...p, [unidadeId]: true }));
    setErrorMap((p) => ({ ...p, [unidadeId]: null }));

    try {
      // Usa a mesma server action, que é flexível o suficiente para aceitar isso
      const updated = await updateAction({ id: unidadeId, updates: initialPayload });

      // Atualiza a UI com os dados retornados pelo servidor
      setUnidadeState((prev) => prev.map((u) => (u.id.toString() === unidadeId ? { ...u, ...updated } : u)));

      // Não há "pending changes" para limpar, pois não existiam
    } catch (err: unknown) {
      console.error('[Client] sendInitialActivation error', err);
      setErrorMap((p) => ({ ...p, [unidadeId]: err instanceof Error ? err.message : 'Erro desconhecido' }));
    } finally {
      setIsUpdating((p) => ({ ...p, [unidadeId]: false }));
    }
  };


  return (
    <section className={`${poppins.className} w-full px-4 py-6 bg-background min-h-screen`}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className="col-span-full">
          <h1 className="text-foreground text-2xl font-bold">Controle de Salas</h1>
        </div>

        {unidadeState.map((u) => {
          // Variável para identificar facilmente se a unidade está no estado inicial/desligado
          const isUnitInactive = u.current_temperatura === null;

          return (
            <Card key={u.id} className="hover:shadow-xl transition-all duration-300 border-border" sx={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
              <CardHeader title={u.name} subheader={`Última atualização: ${u.last_updated_at ?? 'N/A'}`} className='pb-4' />
              <CardContent className='space-y-6'>
                <InteractiveParameterControl
                  label="Temperatura"
                  value={u.current_temperatura}
                  unit="°C"
                  min={17}
                  max={25}
                  step={1}
                  onChangeAction={(value) => updateParameter(u.id.toString(), 'current_temperatura', value)}
                  // Desabilitar se a unidade não tiver sido ativada ainda
                  disabled={isUnitInactive}
                />
                <InteractiveParameterControl
                  label="Modo"
                  value={u.current_modo ?? 'off'}
                  options={[
                    { value: 'auto', label: 'Automático' },
                    { value: 'cool', label: 'Refrigerar' },
                    { value: 'heat', label: 'Aquecer' },
                    { value: 'off', label: 'Desligado' },
                  ]}
                  onChangeAction={(value) => updateParameter(u.id.toString(), 'current_modo', value)}
                  // Desabilitar se a unidade não tiver sido ativada ainda
                  disabled={isUnitInactive}
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
                  // Desabilitar se a unidade não tiver sido ativada ainda
                  disabled={isUnitInactive}
                />

                {errorMap[u.id] && <div className="text-sm text-red-500">{errorMap[u.id]}</div>}

                <div className='flex gap-4 mt-4'>
                  {/* --- LÓGICA DO BOTÃO MODIFICADA --- */}
                  {isUnitInactive ? (
                    <Button
                      fullWidth
                      variant='outlined' // Usei 'contained' para dar mais destaque à ação principal
                      disabled={!!isUpdating[u.id]}
                      onClick={() => sendInitialActivation(u.id.toString())}
                      sx={{
                        borderColor: "var(--primary)", color: "var(--primary)",
                        "&:hover": {
                          backgroundColor: "var(--primary)",
                          color: "var(--card)"
                        }, "&.Mui-disabled": {
                          borderColor: "var(--muted-foreground)",
                          color: "var(--muted-foreground)"
                        }
                      }}
                    >
                      {isUpdating[u.id] ? 'Ativando...' : 'Ativar e Refrigerar'}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant='outlined'
                      disabled={!pendingChanges[u.id] || !!isUpdating[u.id]}
                      onClick={() => { sendUpdate(u.id.toString()); MqttEnvioDeJson(u.id.toString()) }}
                      sx={{
                        borderColor: "var(--primary)", color: "var(--primary)",
                        "&:hover": {
                          backgroundColor: "var(--primary)",
                          color: "var(--card)"
                        }
                      }}
                    >
                      {isUpdating[u.id] ? 'Atualizando...' : (pendingChanges[u.id] ? 'Atualizar Parâmetros' : 'Parâmetros Atualizados')}
                    </Button>
                  )}

                  <Button fullWidth className='w-full mt-4 bg-transparent' variant='outlined'

                    sx={{
                      borderColor: "var(--border)",
                      "&:hover": {
                        backgroundColor: "var(--primary)",
                        color: "var(--muted)"
                      }, color: "var(--primary-strong)",
                    }}
                  >
                    <Link href={`/salas/${u.id}/`}>Ampliar Informações</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}