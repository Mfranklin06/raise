'use client';

import { Poppins } from 'next/font/google';
import { UnidadeAC } from '@/lib/data';
import { Card, CardContent, CardHeader } from '@mui/material';
import { InteractiveParameterControl } from './InteractiveParameters';
import { useState } from 'react';

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
});

const modeConfig = {
  auto: { label: "Automático", color: "bg-blue-500" },
  cool: { label: "Refrigerar", color: "bg-cyan-500" },
  heat: { label: "Aquecer", color: "bg-orange-500" },
  off: { label: "Desligado", color: "bg-gray-500" },
}

export default function SalasCards({ unidades }: { unidades: UnidadeAC[] }) {
  const [unidade, setUnidade] = useState(unidades)
  const updateParameter = (unidadeId: string, parameter: string, value: number | string) => {
    setUnidade((prev) =>
      prev.map((unidade) => (unidade.id.toString() === unidadeId ? { ...unidade, [parameter]: value, lastUpdate: "agora" } : unidade)),
    )
  }
  return (
    <section className={`${poppins.className} w-full px-4 py-6 bg-background min-h-screen`}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className="col-span-full">
          <h1 className="text-foreground text-2xl font-bold">Controle de Salas</h1>
          <p className="text-foreground">Gerencie todos parametros de cada sala de forma fácil!</p>
          <div>pesquisa</div>
        </div>

        {unidade.map((unidades) => (
          <Card
            key={unidades.id}
            className="bg-card hover:shadow-xl transition-all duration-300 border-border"
            sx={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
            }}
          >
            <CardHeader
              title={unidades.name}
              subheader={`Última atualização: ${unidades.last_updated_at ? unidades.last_updated_at : "N/A"}`}
              className='pb-4'
              sx={{
                '& .MuiCardHeader-title': {
                  color: 'inherit',
                  fontSize: '1.25rem',
                  fontWeight: 600
                },
                '& .MuiCardHeader-content': {
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',

                }
              }}
            />
            
        <CardContent>
          <InteractiveParameterControl
            label="Temperatura"
            value={unidades.current_temperatura}
            unit="°C"
            min={17}
            max={25}
            step={1}
            onChangeAction={(value) => updateParameter(unidades.id.toString(), "current_temperatura", value)}
            disabled={unidades.current_status === "desligado"}
          />
          <InteractiveParameterControl
            label='Modo'
            value={unidades.current_modo ? unidades.current_modo : "off"}
            options={Object.entries(modeConfig).map(([value, { label }]) => ({ value, label }))}
            onChangeAction={(value) => updateParameter(unidades.id.toString(), "current_modo", value)}
            disabled={unidades.current_status === "desligado"}
          />
          <InteractiveParameterControl 
            label='Ventilação'
            value={unidades.current_ventilacao || 'auto'}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'auto', label: 'Automática' },
            ]}
            onChangeAction={(value) => updateParameter(unidades.id.toString(), "current_ventilacao", value)}
            disabled={unidades.current_status === 'desligado'}
          />
        </CardContent>
      </Card>
        ))}
    </div>
    </section >
  );
  {/*return (

    <section className={`${poppins.className}`}>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mt-4 pt-20 text-foreground dark:text-foreground'>

        <h1>Controle de Salas</h1>
        <p>Gerencie todos parametros de cada sala de forma fácil!</p>

        <div>pesquisa</div>

        {unidade.map((unidades) => (
          <Card key={unidades.id} className="room-card border-border hover:shadow-xl transition-all duration-300">
            <CardHeader
              title={unidades.name}
              className='pb-4'
              titleTypography={{ variant: 'h5', className: 'text-xl font-semibold text-foreground dark:text-foreground' }}
            />
            <CardContent className='flex items-center flex-col space-y-6'>
              <InteractiveParameterControl
                label="Temperatura"
                value={unidades.current_temperatura}
                unit="°C"
                min={16}
                max={30}
                step={1}
                onChangeAction={(value) => updateParameter(unidades.id.toString(), "current_temperatura", value)}
                disabled={unidades.current_status === "desligado"}
              />
              <InteractiveParameterControl
                label='modo'
                value={unidades.current_modo}
                options={modeConfig ? Object.entries(modeConfig).map(([value, { label }]) => ({ value, label })) : undefined}
                onChangeAction={(value) => updateParameter(unidades.id.toString(), "current_modo", value)}
                disabled={unidades.current_status === "desligado"}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
*/
  }
}