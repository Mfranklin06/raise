import { db } from "@vercel/postgres";

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

  // Optional fields for runtime data or legacy compatibility
  current_raw_code?: string;
  raw_code?: string;
  raw?: string;
  nome?: string;
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

export const getUnidadesAC = async (): Promise<UnidadeAC[]> => {
  try {
    console.log("Buscando todas as unidades de AC...");
    const { rows } = await db.query<UnidadeAC>(
      "SELECT * FROM unidades_ac ORDER BY id;"
    );
    console.log("Unidades de AC encontradas:", rows);
    return rows;
  } catch (error) {
    console.error("Erro em getUnidadesAC:", error);
    return [];
  }
};

export const getUnidadeComCodigos = async (
  id: number
): Promise<{ unidade: UnidadeAC; codigos: CodigoRaw[] } | null> => {
  try {
    console.log(`Buscando unidade com ID: ${id}`);
    const unidadeResult = await db.query<UnidadeAC>(
      "SELECT * FROM unidades_ac WHERE id = $1;",
      [id]
    );
    console.log("Resultado da busca da unidade:", unidadeResult.rows);

    if (unidadeResult.rows.length === 0) {
      console.log("Unidade não encontrada.");
      return null; // Não encontrou a unidade
    }

    const codigosResult = await db.query<CodigoRaw>(
      "SELECT * FROM codigos_raw WHERE unidade_id = $1 ORDER BY description;",
      [id]
    );
    console.log("Resultado da busca dos códigos:", codigosResult.rows);

    return {
      unidade: unidadeResult.rows[0],
      codigos: codigosResult.rows,
    };
  } catch (error) {
    console.error("Erro em getUnidadeComCodigos:", error);
    return null;
  }
};

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

export async function updateUnidadeACState(
  unidadeId: string | number,
  updates: Record<string, unknown>
): Promise<UnidadeAC> {
  // aliases: ordem representa prioridade (primeiro ganha)
  const aliases: Record<string, string[]> = {
    current_temperatura: ['current_temperatura', 'temperatura', 'temp'],
    current_modo: ['current_modo', 'modo'],
    current_ventilacao: ['current_ventilacao', 'ventilacao', 'vent'],
    current_status: ['current_status', 'status'],
  };

  // --- 1) Normalizar: criar objeto com chaves canônicas sem duplicatas ---
  const normalized: Record<string, unknown> = {};
  for (const canonical of Object.keys(aliases)) {
    for (const a of aliases[canonical]) {
      if (Object.prototype.hasOwnProperty.call(updates, a)) {
        normalized[canonical] = updates[a as keyof typeof updates];
        break;
      }
    }
  }

  // --- 2) Derivar current_status a partir de current_modo (SE houver modo) ---
  if (normalized.current_modo !== undefined && normalized.current_modo !== null) {
    const modoStr = String(normalized.current_modo).trim().toLowerCase();
    normalized.current_status = modoStr === 'off' ? 'desligado' : 'ligado';
    normalized.current_modo = modoStr === 'off' ? 'desligado' : normalized.current_modo;
    normalized.current_temperatura = modoStr === 'off' ? null : normalized.current_temperatura;
    normalized.current_ventilacao = modoStr === 'off' ? null : normalized.current_ventilacao;
  }

  // --- 3) Monta colunas e valores (garantindo unicidade das colunas) ---
  const fieldToColumn: Record<string, string> = {
    current_temperatura: 'current_temperatura',
    current_modo: 'current_modo',
    current_ventilacao: 'current_ventilacao',
    current_status: 'current_status',
  };

  const cols: string[] = [];
  const values: unknown[] = [];

  for (const [k, v] of Object.entries(normalized)) {
    const col = fieldToColumn[k];
    if (!col) continue; // ignora chaves não mapeadas
    // empurra apenas uma vez por coluna (normalized já evita duplicatas)
    values.push(v);
    cols.push(`${col} = $${values.length}`);
  }

  try {
    if (cols.length === 0) {
      // nada a atualizar -> retorna a linha atual
      const select = await db.query('SELECT * FROM unidades_ac WHERE id = $1', [unidadeId]);
      return (select.rows[0]);
    }

    // adiciona last_updated_at
    const setClause = cols.join(', ') + ', last_updated_at = NOW()';
    const idPlaceholder = values.length + 1;
    const sql = `UPDATE unidades_ac SET ${setClause} WHERE id = $${idPlaceholder} RETURNING *;`;
    values.push(unidadeId);

    console.log('[DATA] update SQL:', sql, 'values:', values); // opcional para debug
    const res = await db.query(sql, values);

    const updated = res.rows?.[0];
    if (!updated) throw new Error('Unidade não encontrada após UPDATE.');
    return updated as UnidadeAC;
  } catch (err) {
    console.error('[DATA] updateUnidadeACState error:', err);
    throw err;
  }
}

export const getUnidadesComEstadoECodigo = async () => {
  try {

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


    return rows;
  } catch (error) {
    console.error("Erro ao buscar unidades com estado e código:", error);
    throw new Error("Falha ao buscar dados das unidades.");
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
       LIMIT 1;`,
      [unidadeId, modo, temperatura, ventilacao]
    );

    if (rows.length > 0) {
      return rows[0].raw_code as string;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar código raw:", error);
    return null;
  }
};

export const findUnidadeACById = async (
  unidadeId: string
): Promise<UnidadeAC | null> => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM unidades_ac WHERE id = $1 LIMIT 1;`,
      [unidadeId]
    );

    if (rows.length > 0) {
      return rows[0] as UnidadeAC;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar unidade de AC por ID:", error);
    return null;
  }
};