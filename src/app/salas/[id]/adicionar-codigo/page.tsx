import { Box } from "@mui/material";
import { getUnidadeComCodigos } from "@/lib/data";
import { addCodigoRawAction } from "../../../actions"; // Criaremos esta Action a seguir

// A página recebe 'params' que contém o 'id' da URL
export default async function AdicionarCodigoPage({ params }: { params: { id: number } }) {
  const unidadeId = params.id;
  const data = await getUnidadeComCodigos(unidadeId);

  if (!data) {
    return <h1>Unidade de AC não encontrada.</h1>;
  }

  return (
    <main className="bg-background flex min-w-screen min-h-screen flex-col justify-center items-center">
      <Box className="bg-card p-8 rounded-lg shadow-md w-[40%]">
        <h1 className="text-2xl font-bold mb-4">
          Adicionar Código para: <span className="text-card-foreground">{data.unidade.name}</span>
        </h1>

        <form action={addCodigoRawAction} className="flex flex-col space-y-4">
          {/* CAMPO OCULTO: Essencial para a Action saber a qual AC o código pertence */}
          <input type="hidden" name="unidadeId" value={unidadeId} />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">Descrição</label>
            <input
              type="text" id="description" name="description" required
              placeholder="Ex: Ligar 22°C - Frio - Vent. Auto"
              className="mt-1 block w-full border border-boder rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="raw_code" className="block text-sm font-medium text-muted-foreground">Código RAW</label>
            <textarea
              id="raw_code" name="raw_code" required rows={3}
              placeholder="Cole o código infravermelho aqui..."
              className="bg-card text-card-foreground mt-1 block w-full border border-border rounded-lg shadow-sm p-2"
            />
          </div>

          <h2 className="text-lg font-semibold border-t pt-4 mt-2">Metadados</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="config_temperatura" className="block text-sm font-medium text-muted-foreground">Temperatura</label>
              <input type="number" id="config_temperatura" name="config_temperatura" min={"17"} max={"25"} className="bg-card text-card-foreground mt-1 block w-full border border-border rounded-lg shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="config_modo" className="block text-sm font-medium text-muted-foreground">Modo</label>
              <select id="config_modo" name="config_modo" className="bg-card text-card-foreground mt-1 block w-full border border-border rounded-lg shadow-sm p-2">
                <option value={"desligado"}>Desligado</option>
                <option value={"frio"}>Frio</option>
                <option value="quente">Quente</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            <div>
              <label htmlFor="config_ventilacao" className="block text-sm font-medium text-muted-foreground">Ventilação</label>
              <select id="config_ventilacao" name="config_ventilacao" className="bg-card text-card-foreground mt-1 block w-full border border-border rounded-lg shadow-sm p-2">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="auto">Automática</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-card text-card-foreground border-border px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-2 font-bold hover:bg-primary hover:text-muted">
            Salvar Código
          </button>
        </form>
      </Box>
    </main>
  );
}