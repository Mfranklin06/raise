// src/lib/data.ts
import { db } from "@vercel/postgres";

// --- Interfaces para os novos formatos ---
export interface UnidadeAC {
  id: number;
  name: string;
  location: string | null;
  brand_model: string | null;
  created_at: string;

  current_status: string | null;
  current_temperatura: number | null;
  current_modo: string | null;
  current_ventilacao: string | null;
  last_updated_at: string | null;
}

export interface CodigoRaw {
  id: number;
  unidade_id: number;
  description: string;
  raw_code: string;
  config_temperatura?: number;
  config_modo?: string;
  config_ventilacao?: string;
}

// --- Novas funções de acesso aos dados ---

// Função para buscar TODAS as unidades de AC (sem os códigos)
export const getUnidadesAC = async (): Promise<UnidadeAC[]> => {
  const { rows } = await db.query<UnidadeAC>(
    "SELECT * FROM unidades_ac ORDER BY id;"
  );
  return rows;
};

// Função para buscar UMA unidade de AC e TODOS os seus códigos associados
export const getUnidadeComCodigos = async (
  id: number
): Promise<{ unidade: UnidadeAC; codigos: CodigoRaw[] } | null> => {
  const unidadeResult = await db.query<UnidadeAC>(
    "SELECT * FROM unidades_ac WHERE id = $1;",
    [id]
  );

  if (unidadeResult.rows.length === 0) {
    return null; // Não encontrou a unidade
  }

  const codigosResult = await db.query<CodigoRaw>(
    "SELECT * FROM codigos_raw WHERE unidade_id = $1 ORDER BY description;",
    [id]
  );

  return {
    unidade: unidadeResult.rows[0],
    codigos: codigosResult.rows,
  };
};

// Função para adicionar um NOVO CÓDIGO a uma unidade de AC existente
export const addCodigoRaw = async (
  unidadeId: number,
  dadosCodigo: Omit<CodigoRaw, "id" | "unidade_id">
) => {
  const {
    description,
    raw_code,
    config_temperatura,
    config_modo,
    config_ventilacao,
  } = dadosCodigo;

  await db.query(
    `INSERT INTO codigos_raw (unidade_id, description, raw_code, config_temperatura, config_modo, config_ventilacao)
     VALUES ($1, $2, $3, $4, $5, $6);`,
    [
      unidadeId,
      description,
      raw_code,
      config_temperatura,
      config_modo,
      config_ventilacao,
    ]
  );
};

type NovaUnidadeAC = {
  name: string;
  location: string | null;
  brand_model: string | null;
};

// A função para adicionar uma nova UNIDADE DE AC (sem códigos)
export const addUnidadeAC = async (dadosUnidade: NovaUnidadeAC) => {
  const { name, location, brand_model } = dadosUnidade;
  try {
    await db.query(
      "INSERT INTO unidades_ac (name, location, brand_model) VALUES ($1, $2, $3);",
      [name, location, brand_model]
    );
  } catch (error) {
    console.error("Erro ao adicionar nova unidade de AC:", error);
    throw new Error("Falha ao criar nova unidade de AC.");
  }
};

export const updateUnidadeACState = async (
  unidadeId: number,
  novoEstado: {
    status: string;
    temperatura: number | null;
    modo: string | null;
    ventilacao: string | null;
  }
) => {
  const { status, temperatura, modo, ventilacao } = novoEstado;

  try {
    await db.query(
      `UPDATE unidades_ac 
       SET 
         current_status = $1, 
         current_temperatura = $2, 
         current_modo = $3, 
         current_ventilacao = $4,
         last_updated_at = NOW()
       WHERE id = $5;`,
      [status, temperatura, modo, ventilacao, unidadeId]
    );
  } catch (error) {
    console.error("Erro ao atualizar o estado da unidade:", error);
    throw new Error("Falha ao atualizar o estado.");
  }
};

export const getUnidadesComEstadoECodigo = async () => {
  try {
    // Esta consulta única e correta faz todo o trabalho no banco de dados.
    const { rows } = await db.query(`
      SELECT
        ua.*, -- Pega todas as colunas da tabela de unidades
        cr.raw_code AS current_raw_code -- Pega o código raw correspondente, se encontrar
      FROM
        unidades_ac ua -- Começa com a tabela de unidades (a tabela da "esquerda")
      LEFT JOIN
        codigos_raw cr -- Junta com a tabela de códigos (a tabela da "direita")
      ON
        -- A cláusula ON define TODAS as regras para encontrar uma correspondência
        ua.id = cr.unidade_id -- Regra 1: O ID da unidade deve ser o mesmo.
        
        -- Regra 2: O modo/status deve corresponder.
        -- 'desligado' está em 'current_status', mas 'frio' está em 'current_modo',
        -- então COALESCE escolhe o primeiro valor que não for nulo para comparar.
        AND COALESCE(ua.current_modo, ua.current_status) = cr.config_modo
        
        -- Regra 3: A temperatura deve ser igual OU ambas devem ser nulas.
        AND (ua.current_temperatura = cr.config_temperatura OR (ua.current_temperatura IS NULL AND cr.config_temperatura IS NULL))
        
        -- Regra 4: A ventilação deve ser igual OU ambas devem ser nulas.
        AND (ua.current_ventilacao = cr.config_ventilacao OR (ua.current_ventilacao IS NULL AND cr.config_ventilacao IS NULL))
      ORDER BY
        ua.id;
    `);
    
    // A consulta agora retorna todas as unidades, com 'current_raw_code' preenchido ou nulo.
    return rows;

  } catch (error) {
    console.error('Erro ao buscar unidades com estado e código:', error);
    throw new Error('Falha ao buscar dados das unidades.');
  }
};

export const findRawCodeForState = async (
  unidadeId: number,
  estado: {
    modo: string;
    temperatura: number | null;
    ventilacao: string | null;
  }
) => {
  const { modo, temperatura, ventilacao } = estado;

  try {
    const { rows } = await db.query(
      `SELECT raw_code FROM codigos_raw
       WHERE
         unidade_id = $1
         AND config_modo IS NOT DISTINCT FROM $2
         AND config_temperatura IS NOT DISTINCT FROM $3
         AND config_ventilacao IS NOT DISTINCT FROM $4
       LIMIT 1;`, // LIMIT 1 para garantir que pegamos apenas um resultado
      [unidadeId, modo, temperatura, ventilacao]
    );

    if (rows.length > 0) {
      return rows[0].raw_code as string;
    }
    
    return null; // Retorna null se nenhum código for encontrado para essa combinação
  
  } catch (error) {
    console.error("Erro ao buscar código raw:", error);
    return null;
  }
};