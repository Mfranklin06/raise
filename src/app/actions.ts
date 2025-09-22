"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addCodigoRaw, findRawCodeForState, UnidadeAC, updateUnidadeACState } from "@/lib/data";

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

type Updates = Record<string, unknown>;

type PayloadObject = {
  id: string;
  updates: Updates;
};

// A action aceita tanto FormData quanto o objeto { id, updates }
export async function updateEstadoAction(arg: FormData | PayloadObject): Promise<UnidadeAC> {
  // normalize para id + updates
  let idStr: string;
  let updates: Updates = {};

  if (arg instanceof FormData) {
    // === caso FormData (compatibilidade com <form>) ===
    const unidadeIdRaw = arg.get('unidadeId');
    const modoRaw = arg.get('modo');
    const tempRaw = arg.get('temperatura');
    const ventRaw = arg.get('ventilacao');

    if (!unidadeIdRaw) throw new Error('ID da unidade é obrigatório no FormData.');
    idStr = String(unidadeIdRaw);

    if (modoRaw != null) updates.current_modo = String(modoRaw);
    if (tempRaw != null && String(tempRaw).length > 0) {
      const parsed = parseInt(String(tempRaw), 10);
      if (!Number.isNaN(parsed)) updates.current_temperatura = parsed;
    }
    if (ventRaw != null) updates.current_ventilacao = String(ventRaw);

    // Se quiser manter sua lógica original de achar raw code e enviar para o hardware:
    const unidadeIdNum = parseInt(idStr, 10);
    const modo = updates.current_modo as string ;
    const temperatura = updates.current_temperatura as number | null;
    const ventilacao = updates.current_ventilacao as string | null;

    const rawCode = await findRawCodeForState(unidadeIdNum, {
      modo,
      temperatura,
      ventilacao,
    });

    if (!rawCode) {
      // no seu código anterior você fazia apenas console.error e retornava.
      // Aqui vamos lançar erro para que o client saiba que não foi possível executar.
      throw new Error(`Nenhum código RAW encontrado para: modo=${modo}, temperatura=${temperatura}`);
    }

    // TODO: envie o rawCode para o hardware aqui (sua implementação)
    // ex: await sendToHardware(unidadeIdNum, rawCode);
    console.log(`[action] Enviando RAW para unidade ${unidadeIdNum}:`, rawCode);

  } else {
    // === caso seja o objeto { id, updates } vindo do client ===
    const { id, updates: u } = arg;
    if (!id) throw new Error('id é obrigatório no payload.');
    idStr = String(id);
    updates = { ...(u ?? {}) };
    // Opcional: aqui você pode validar os campos recebidos (ranges, tipos)
  }

  // Atualiza o banco (updateUnidadeACState) — espera-se que essa função retorne a unidade atualizada
  try {
    // Normalizar nomes/colunas se preciso dentro de updateUnidadeACState
    const updated = await updateUnidadeACState(idStr, updates);

    // Revalida a rota principal para refletir o novo estado no server-side rendering
    try {
      revalidatePath('/');
    } catch (e) {
      console.warn('[action] revalidatePath falhou (não crítico):', e);
    }

    return updated;
  } catch (err) {
    console.error('[action] updateEstadoAction error:', err);
    // repassa pro client
    throw err;
  }
}