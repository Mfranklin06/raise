// src/app/page.tsx

import { Poppins } from 'next/font/google';
import SalasCards from "./components/ui/SalasCards";
// Importamos a nova função que busca dados do banco
import { getUnidadesAC, UnidadeAC } from '@/lib/data'; 

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
});

// A função agora é async, pois a consulta ao banco de dados leva um tempo.
async function getUnidades(): Promise<UnidadeAC[]> {
  const unidades = await getUnidadesAC();
  return unidades;
}

export default async function Home() {
  // Usamos 'await' para esperar a resposta do banco de dados.
  const unidades = await getUnidades();

  return (
    <main>
      <h1 className={`${poppins.className} text-white text-center justify-center pt-20 text-4xl`}>
        Unidades Disponíveis
      </h1>
      {/* IMPORTANTE: O componente SalasCards agora receberá um array de 'UnidadeAC'.
        Você precisará atualizar o componente SalasCards para ler as novas propriedades,
        como 'unidade.name', 'unidade.location', 'unidade.current_temperatura', etc.
      */}
      <SalasCards unidades={unidades} />
    </main>
  );
}