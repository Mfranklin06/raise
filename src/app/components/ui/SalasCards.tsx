'use client';

import { Box } from '@mui/material'
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
});
export default function SalasCards({salas}: {salas: { id: number; name: string; status: string; temperatura: number; }[]}) {
  return (
    <Box sx={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, display: 'grid', justifyItems: 'center', mt: 4, pt: 20 }}>
        {salas.map((sala) => (
          <Box
            key={sala.id}
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
                {sala.name}
              </h1>
              <h2>
                Status: {sala.status} | Temperatura: {sala.temperatura}°C
              </h2>
            </div>
          </Box>
        ))}
      </Box>
  )
}