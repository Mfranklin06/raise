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

  const baseUrl = process.env.VERCEL_URL 
  ? 'https://${process.env.VERECEL_URL}'
  : 'http://localhost:3000';

  const url = `${baseUrl}/api/salas`;
  console.log('Fetching from URL:', url);

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch salas');
  }
  return res.json();
}



export default async function Home() {
  const salas = await fetchSalas();
  return (
    <main>
      <h1 className={`${poppins.className} text-white text-center justify-center pt-20 text-4xl`}>
        Salas disponíveis
      </h1>
      <SalasCards salas={salas} />
    </main>
  );
}
