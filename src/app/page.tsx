import { Poppins } from 'next/font/google';
import SalasCards from "./components/ui/SalasCards";
import { getSalasData } from '@/lib/data';
const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin'],
});

interface Sala {
  id: number;
  name: string;
  status: string;
  temperatura: number;
}

function getSalas(): Sala[] {
  return getSalasData();
}



export default async function Home() {
  const salas = getSalas();
  return (
    <main>
      <h1 className={`${poppins.className} text-white text-center justify-center pt-20 text-4xl`}>
        Salas disponíveis
      </h1>
      <SalasCards salas={salas} />
    </main>
  );
}
