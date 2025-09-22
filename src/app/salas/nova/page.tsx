import { Box } from "@mui/material";
import { criarSalaAction } from "../../actions";

export default function NovaSalaPage() {
    return (
        <main className="flex min-w-screen min-h-screen flex-col justify-center">
            <Box className="bg-white p-8 rounded-lg shadow-md w-[30%]">

            <h1>Criar nova sala</h1>
            <form action={criarSalaAction} className="flex flex-col">
                <div>
                    <label htmlFor="nome" className="pl-[1em]">Nome da Sala</label>
                    <input type="text" id="nome" name="nome" required className="border border-black rounded-lg pr-[2em]"/>
                </div>
                <div>
                    <label htmlFor="location" className="pl-[1em]">Location</label>
                    <input type="text" id="location" name="location" required className="border border-black rounded-lg pr-[2em]" />
                </div>
                <div>
                    <label htmlFor="brand_model" className="pl-[1em]">Modelo</label>
                    <input type="text" id="brand_model" name="brand_model" required className="border border-black rounded-lg pr-[2em]" />
                </div>
                <button type="submit" className="border border-black rounded-lg p-2">Salvar</button>
            </form>
            </Box>
        </main>
    );
}