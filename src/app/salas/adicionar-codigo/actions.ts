'use server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import z from 'zod';

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const schemaEnvioSalaComRaw = z.object({
        id: z.coerce.string(),
        description: z.string().optional(),
        raw_code: z.string().min(10, 'O código raw é obrigatório'),
        config_temperatura: z.coerce.number().int().min(17).max(25),
        config_modo: z.enum(['desligado', 'cool', 'heat', 'auto']),
        config_ventilacao: z.enum(['low', 'mid', 'high', 'auto']),

})

export default async function adicionarCodigoRawAction(formData: FormData) {

        const data = schemaEnvioSalaComRaw.parse({
                id: formData.get('unidade'),
                description: formData.get('description'),
                raw_code: formData.get('raw_code'),
                config_temperatura: formData.get('config_temperatura'),
                config_modo: formData.get('config_modo'),
                config_ventilacao: formData.get('config_ventilacao'),
        })

        const [result] = await sql`INSERT INTO codigos_raw (unidade_id, description, raw_code, config_temperatura, config_modo, config_ventilacao) 
                                                        VALUES (
                                                                ${Number(data.id)},
                                                                ${data.description ?? null},
                                                                ${data.raw_code},
                                                                ${data.config_temperatura},
                                                                ${data.config_modo},
                                                                ${data.config_ventilacao}
                                                        ) `

        revalidatePath(`/salas/${data.id}`);
        revalidatePath(`/salas`);
        redirect('/salas')
}
