'use client';

import { Box, IconButton } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { Poppins } from 'next/font/google';
import { UnidadeAC } from '@/lib/data';
import Link from 'next/link';
import { updateEstadoAction } from '@/app/salas/actions';

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
});
export default function SalasCards({ unidades }: { unidades: UnidadeAC[] }) {
  return (
    <Box sx={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, display: 'grid', justifyItems: 'center', mt: 4, pt: 20 }}>
      {unidades.map((unidades) => (
        <Box
          key={unidades.id}
          sx={{
            width: 550,
            height: 200,
            backgroundColor: 'gray',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            boxShadow: 3,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#darkgray',
            },

          }}
        >
          <div className={`${poppins.className} grid grid-cols-1 gap-4 text-center text-xl`}>
            <h1>
              {unidades.name}
            </h1>
            <h2>
              Status: {unidades.current_status} | Temperatura: {unidades.current_temperatura}°C
            </h2>
            <div className="flex items-center gap-2">
              {/* Formulário para DECREMENTAR temperatura */}
              <form action={updateEstadoAction}>
                <input type="hidden" name="unidadeId" value={unidades.id} />
                <input type="hidden" name="modo" value="frio" />
                <input type="hidden" name="ventilacao" value="auto" />
                <input type="hidden" name="temperatura" value={unidades.current_temperatura ? unidades.current_temperatura - 1 : 22} />
                <IconButton type="submit" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Remove />
                </IconButton>
              </form>
              
              <span className="text-3xl font-bold w-16 text-center">
                {unidades.current_temperatura ?? '--'}°C
              </span>

              {/* Formulário para INCREMENTAR temperatura */}
              <form action={updateEstadoAction}>
                <input type="hidden" name="unidadeId" value={unidades.id} />
                <input type="hidden" name="modo" value="frio" />
                <input type="hidden" name="ventilacao" value="auto" />
                <input type="hidden" name="temperatura" value={unidades.current_temperatura ? unidades.current_temperatura + 1 : 22} />
                <IconButton type="submit" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Add />
                </IconButton>
              </form>
            </div>
            <Link
              href={`/salas/${unidades.id}/adicionar-codigo`}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adicionar Código
            </Link>
          </div>

        </Box>
      ))}
    </Box>
  )
}