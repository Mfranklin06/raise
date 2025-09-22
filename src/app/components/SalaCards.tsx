"use client"

import { useState } from "react"
import { InteractiveParameterControl } from "./InteractiveParameters"
import { Card, CardContent, CardHeader } from "@mui/material"
import { UnidadeAC } from "@/lib/data"
import { BoltIcon, ChartBarIcon, CogIcon } from "@heroicons/react/24/solid"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"

export function SalaCards({ unidades }: { unidades: UnidadeAC }) {
    const [unidade, setUnidade] = useState(unidades)

    const updateParameter = (parameter: string, value: number | string | null) => {
        setUnidade((prev) => ({ ...prev, [parameter]: value }))
    }


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Controles de Parâmetros</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Temperature Control */}
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
                                <p className="text-2xl font-bold text-foreground">{unidade.current_temperatura}°C</p>
                            </div>
                            <InteractiveParameterControl
                                label="Temperatura Desejada"
                                value={unidade.current_temperatura}
                                unit="°C"
                                min={17}
                                max={25}
                                step={1}
                                onChangeAction={(value) => updateParameter("targetTemperature", value)}
                                disabled={unidade.current_status === "desligado"}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Mode Control */}
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
                            value={unidade.current_modo ? unidade.current_modo : "off"}
                            options={[
                                { value: "auto", label: "Automático" },
                                { value: "cool", label: "Refrigerar" },
                                { value: "heat", label: "Aquecer" },
                                { value: "off", label: "Desligado" },
                            ]}
                            onChangeAction={(value) => updateParameter("current_modo", value)}
                            disabled={unidade.current_status === "desligado"}
                        />
                    </CardContent>
                </Card>

                {/* Ventilation Control */}
                <Card className="room-card">
                    <CardHeader
                        sx={{
                            "& .MuiCardHeader-title": { color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 600 },
                            "& .MuiCardHeader-content": { fontSize: "0.875rem", color: "var(--card-foreground)" },
                        }}
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Ventilação
                    </CardHeader>
                    <CardContent>
                        <InteractiveParameterControl
                            label="Velocidade"
                            value={unidade.current_ventilacao ? unidade.current_ventilacao : "auto"}
                            min={0}
                            max={5}
                            step={1}
                            onChangeAction={(value) => updateParameter("ventilation", value)}
                            disabled={unidade.current_status === "desligado"}
                        />
                    </CardContent>
                </Card>

                {/* Humidity Display to implement*/}


                {/* Power Consumption */}
                <Card className="room-card">
                    <CardHeader
                        sx={{
                            "& .MuiCardHeader-title": { color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 600 },
                            "& .MuiCardHeader-content": { fontSize: "0.875rem", color: "var(--card-foreground)" },
                        }}
                    >
                        <BoltIcon className="w-5 h-5" />
                        Consumo

                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-foreground"></p> {/*unidade.powerConsumption*/}
                            <p className="text-sm text-muted-foreground">kW/h</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="room-card">
                    <CardHeader
                        sx={{
                            "& .MuiCardHeader-title": { color: "var(--foreground)", fontSize: "1.25rem", fontWeight: 600 },
                            "& .MuiCardHeader-content": { fontSize: "0.875rem", color: "var(--card-foreground)" },
                        }}
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Ações Rápidas
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <button
                            onClick={() => {
                                updateParameter("current_modo", "auto")
                                updateParameter("current_temperatura", 22)
                                updateParameter("ventilation", "mid")
                            }}
                            disabled={unidade.current_modo === "auto" && unidade.current_temperatura === 22 && unidade.current_ventilacao === "mid"}
                            className="w-full p-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Modo Eco
                        </button>
                        <button
                            onClick={() => {
                                updateParameter("current_moco", "cool")
                                updateParameter("current_temperatura", 20)
                                updateParameter("current_ventilacao", "high")
                            }}
                            disabled={unidade.current_modo === "cool" && unidade.current_temperatura === 20 && unidade.current_ventilacao === "high"}
                            className="w-full p-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Resfriamento Rápido
                        </button>
                        <button
                            onClick={() => {
                                updateParameter("current_modo", "off")
                            }}
                            disabled={unidade.current_modo === "off"}
                            className="w-full p-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Desligar Tudo
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
