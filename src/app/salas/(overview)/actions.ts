// arquivo criado com intuito de substituir o data.ts ou outros actions, 
// porém de forma mais organizada e seguindo uma melhor e mais limpa arquitetura

'use server';

import postgres from 'postgres'; // instalar o postgres depois, a fim de substituir o db
import { UnidadeAC } from '@/lib/data';

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export default async function GetSalas(): Promise<UnidadeAC[]> {

        'use cache';

        const result = await sql<UnidadeAC[]>`
                SELECT * FROM unidades_ac ORDER BY id
        `;
        return result as UnidadeAC[];
}
