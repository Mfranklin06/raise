"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addCodigoRaw,
  findRawCodeForState,
  findUnidadeACById,
  UnidadeAC,
  updateUnidadeACState,
} from "@/lib/data";

export async function criarSalaAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const location = formData.get("location") as string;
  const brand_model = formData.get("brand_model") as string;

  const response = await fetch("https://raise-eight.vercel.app/api/salas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nome,
      location: location,
      brand_model: brand_model,
    }),
  });
  if (!response.ok) {
    throw new Error("Erro ao criar a sala");
  }

  revalidatePath("/");
  // Redirect to home page
  redirect("/");
}

export async function addCodigoRawAction(formData: FormData) {
  
  const unidadeId = parseInt(formData.get("unidadeId") as string, 10);
  const description = formData.get("description") as string;
  const raw_code = formData.get("raw_code") as string;

  const config_temperatura = formData.get("config_temperatura");
  const config_modo = formData.get("config_modo") as string;
  const config_ventilacao = formData.get("config_ventilacao") as string;

  
  if (!unidadeId || !description || !raw_code) {
    throw new Error("ID da Unidade, Descrição e Código RAW são obrigatórios.");
  }

  // 2. Monta o objeto com os dados para salvar
  const dadosCodigo = {
    description,
    raw_code,
    
    config_temperatura: config_temperatura
      ? parseInt(config_temperatura as string, 10)
      : undefined,
    config_modo: config_modo || undefined,
    config_ventilacao: config_ventilacao || undefined,
  };

  
  await addCodigoRaw(unidadeId, dadosCodigo);

  
  revalidatePath(`/salas/${unidadeId}`); // Supondo que você terá uma página de detalhes

  
  redirect(`/salas/${unidadeId}`); // Ou para onde fizer sentido
}

type Updates = Record<string, unknown>;

type PayloadObject = {
  id: string;
  updates: Updates;
};

export async function updateEstadoAction(
  arg: FormData | PayloadObject
): Promise<UnidadeAC> {
  if (arg instanceof FormData) {
    console.log(
      "[action] Conteúdo FormData recebido: ",
      Array.from(arg.entries())
    );
  }

  let idStr: string;
  let updates: Updates = {};

  
  if (arg instanceof FormData) {
    const unidadeIdRaw = arg.get("id");
    if (!unidadeIdRaw) {
      throw new Error("ID da unidade é obrigatório no FormData.");
    }
    idStr = String(unidadeIdRaw);

    const modoRaw = arg.get("current_modo");
    const tempRaw = arg.get("current_temperatura");
    const ventRaw = arg.get("current_ventilacao");

    if (modoRaw != null) updates.current_modo = String(modoRaw);
    if (tempRaw != null && String(tempRaw).length > 0) {
      const parsed = parseInt(String(tempRaw), 10);
      if (!Number.isNaN(parsed)) updates.current_temperatura = parsed;
    }
    if (ventRaw != null) updates.current_ventilacao = String(ventRaw);
  } else {
    const { id, updates: u } = arg;
    if (!id) {
      throw new Error("id é obrigatório no payload.");
    }
    idStr = String(id);
    updates = { ...(u ?? {}) };
  }

  console.log("Objeto 'updates' populado:", updates);

  try {
    const unidadeIdNum = parseInt(idStr, 10);
    if (Number.isNaN(unidadeIdNum)) {
      throw new Error("ID da unidade inválido.");
    }

    const estadoAtual = await findUnidadeACById(idStr);
    if (!estadoAtual) {
      throw new Error(`Unidade de AC com ID ${idStr} não encontrada.`);
    }

    const estadoCompleto = {
      modo: updates.modo as string ?? estadoAtual.current_modo as string,
      temperatura: updates.temperatura as number | null ?? estadoAtual.current_temperatura as number | null,
      ventilacao: updates.ventilacao as string | null ?? estadoAtual.current_ventilacao as string | null,
    };

    if (estadoCompleto.modo === "desligado" || estadoCompleto.modo === "off") {
      estadoCompleto.temperatura = null;
      estadoCompleto.ventilacao = null;
  
      updates.current_temperatura = null;
      updates.current_ventilacao = null;
    }

    console.log("Estado completo para validação:", estadoCompleto);

  
    const rawCode = await findRawCodeForState(unidadeIdNum, estadoCompleto);

    if (!rawCode) {
  
      throw new Error(
        `Configuração inválida: Nenhum código RAW encontrado para modo=${estadoCompleto.modo}, temperatura=${estadoCompleto.temperatura} e ventilação=${estadoCompleto.ventilacao}.`
      );
    }
    console.log(`[action] Código RAW validado para unidade ${unidadeIdNum}. Prosseguindo.`);

    const updated = await updateUnidadeACState(idStr, updates);

    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("[action] revalidatePath falhou (não crítico):", e);
    }

    return updated;
  } catch (err) {
    console.error("[action] updateEstadoAction error:", err);
  
    throw err;
  }
}
