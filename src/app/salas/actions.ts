"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCodigoRaw } from "@/lib/data";

export async function criarSalaAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const location = formData.get("location") as string;
  const brand_model = formData.get("brand_model") as string;

  const response = await fetch("https://raise-eight.vercel.app/api/salas", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(        { 
            name: nome, 
            location: location,
            brand_model: brand_model,
        }
    ),
});
    if (!response.ok) {
        throw new Error("Erro ao criar a sala");
    }

    revalidatePath('/');
    // Redirect to home page
    redirect('/');
};

export async function addCodigoRawAction(formData: FormData) {
  // 1. Extrai os dados do formulário, incluindo o ID oculto
  const unidadeId = parseInt(formData.get('unidadeId') as string, 10);
  const description = formData.get('description') as string;
  const raw_code = formData.get('raw_code') as string;

  const config_temperatura = formData.get('config_temperatura');
  const config_modo = formData.get('config_modo') as string;
  const config_ventilacao = formData.get('config_ventilacao') as string;

  // Validação básica
  if (!unidadeId || !description || !raw_code) {
    throw new Error('ID da Unidade, Descrição e Código RAW são obrigatórios.');
  }

  // 2. Monta o objeto com os dados para salvar
  const dadosCodigo = {
    description,
    raw_code,
    // Converte a temperatura para número ou null se estiver vazia
    config_temperatura: config_temperatura ? parseInt(config_temperatura as string, 10) : undefined,
    config_modo: config_modo || undefined,
    config_ventilacao: config_ventilacao || undefined,
  };

  // 3. Chama a função de 'lib/data.ts' para salvar no banco.
  await addCodigoRaw(unidadeId, dadosCodigo);

  // 4. Limpa o cache da página de detalhes da unidade para mostrar o novo código.
  revalidatePath(`/salas/${unidadeId}`); // Supondo que você terá uma página de detalhes

  // 5. Redireciona o usuário de volta para a página de detalhes da unidade.
  redirect(`/salas/${unidadeId}`); // Ou para onde fizer sentido
}