import { UnidadeAC } from '@/lib/data';
import { cacheLife, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import z from 'zod';

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const SchemaUpdateSala = z.object({
        id: z.coerce.string(),
        current_status: z.enum(['ligado', 'desligado']),
        current_temperatura: z.coerce.number().int().min(17).max(25),
        current_modo: z.enum(['desligado', 'cool', 'heat', 'auto']),
        current_ventilacao: z.enum(['low', 'mid', 'high', 'auto']),
})

export default async function getSalaById(id: string): Promise<UnidadeAC[]> {

        'use cache';
        cacheLife("days");
        const result = await sql<UnidadeAC[]>`
                SELECT * FROM unidades_ac WHERE id = ${Number(id)}
        `;

        return result as UnidadeAC[];
}

export async function UpdateSalaById(formData: FormData): Promise<void> {

        const data = SchemaUpdateSala.parse({
                id: formData.get('id'),
                current_status: formData.get('current_status'),
                current_temperatura: formData.get('current_temperatura'),
                current_modo: formData.get('current_modo'),
                current_ventilacao: formData.get('current_ventilacao'),
        })

        const result = await sql`
                UPDATE unidades_ac SET 
                        current_status = ${data.current_status},
                        current_temperatura = ${data.current_temperatura},
                        current_modo = ${data.current_modo},
                        current_ventilacao = ${data.current_ventilacao}
                WHERE id = ${Number(data.id)}
        `;

        revalidatePath(`/salas/${data.id}`);
        revalidatePath(`/salas`);
        redirect(`/salas/${data.id}`);
}