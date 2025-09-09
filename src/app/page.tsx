import { Poppins } from 'next/font/google';
import SalasCards from "./components/ui/SalasCards";

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

async function fetchSalas(): Promise<Sala[]> {
  const res = await fetch('/api/salas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch salas');
  }
  return res.json();
}



export default async function Home() {
  const salas = await fetchSalas();
  return (
    <main>
      <h1 className={`${poppins.className} text-center justify-center pt-20 text-4xl`}>
        Salas disponíveis
      </h1>
      <SalasCards salas={salas} />
    </main>
  );
}
