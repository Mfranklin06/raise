import { NextResponse } from "next/server";
import { getUnidadesComEstadoECodigo, addUnidadeAC } from "@/lib/data";

// --- GET: Listar todas as unidades ---
export async function GET() {
  // A busca no banco é assíncrona, então usamos await
  const unidades = await getUnidadesComEstadoECodigo();
  return NextResponse.json(unidades);
}

// --- POST: Criar uma nova unidade de AC ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Esperamos os campos definidos na nossa nova tabela
    const { name, location, brand_model } = body;

    // Validação dos dados de entrada
    if (!name || !location || !brand_model) {
      return NextResponse.json(
        { message: 'Nome, localização e marca/modelo são obrigatórios' },
        { status: 400 }
      );
    }

    // Chamamos a função do lib/data.ts que faz o INSERT no banco
    await addUnidadeAC({ name, location, brand_model });
    
    // Retornamos uma mensagem de sucesso. O banco de dados cuidou do ID e do resto.
    return NextResponse.json({ message: 'Unidade de AC criada com sucesso' }, { status: 201 });

  } catch (error) {
    console.error('Erro no POST:', error); // É bom logar o erro no servidor
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

