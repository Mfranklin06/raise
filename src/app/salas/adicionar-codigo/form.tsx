import { BiChevronDown, BiPlus } from "react-icons/bi";
import GetSalas from "../(overview)/actions";
import adicionarCodigoRawAction from "./actions";

export default async function AdicionarCodigoForm() {

        const unidades = await GetSalas();

        return (
                <form action={adicionarCodigoRawAction} className="flex flex-col w-full max-w-[480px] bg-card p-6 sm:p-8 rounded-xl shadow-lg border border-border gap-6">

                        <div className="flex flex-col text-center space-y-1.5 focus:outline-none">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">Adicionar Código RAW</h1>
                                <p className="text-sm text-muted-foreground relative parameter-slider">
                                        Insira as configurações do ar condicionado
                                </p>
                        </div>

                        <div className="flex flex-col gap-5">
                                <input type="hidden" name="id" value="" />

                                <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                        <label htmlFor="unidade" className="text-sm font-medium text-foreground">Unidade</label>
                                        <div className="relative">
                                                <select name="unidade" id="unidade" defaultValue="" className="w-full appearance-none bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 text-foreground cursor-pointer" required>
                                                        <option value="" disabled>Selecione a Unidade</option>
                                                        {unidades.map((unidade) => (
                                                                <option key={unidade.id} value={unidade.id}>
                                                                        {unidade.name}
                                                                </option>
                                                        ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                                                        <BiChevronDown />
                                                </div>
                                        </div>
                                </div>

                                <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                        <label htmlFor="description" className="text-sm font-medium text-foreground">Descrição</label>
                                        <input type="text" id="description" name="description" placeholder="Ex.: 22°C - Frio - Vent. Auto" className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 placeholder:text-muted-foreground/70 text-foreground" required />
                                </div>

                                <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                        <label htmlFor="raw_code" className="text-sm font-medium text-foreground">Código RAW</label>
                                        <input type="text" id="raw_code" name="raw_code" placeholder="Insira o código alfanumérico gerado" className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 placeholder:text-muted-foreground/70 text-foreground font-mono text-sm" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                                <label htmlFor="config_temperatura" className="text-sm font-medium text-foreground">Temperatura</label>
                                                <div className="relative">
                                                        <select name="config_temperatura" id="config_temperatura" defaultValue="" className="w-full appearance-none bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 text-foreground cursor-pointer" required>
                                                                <option value="" disabled>Selecione</option>
                                                                {[...Array(9)].map((_, i) => (
                                                                        <option key={17 + i} value={17 + i}>{17 + i}°C</option>
                                                                ))}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                                                <BiChevronDown />
                                                        </div>
                                                </div>
                                        </div>

                                        <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                                <label htmlFor="config_modo" className="text-sm font-medium text-foreground">Modo</label>
                                                <div className="relative">
                                                        <select name="config_modo" id="config_modo" defaultValue="" className="w-full appearance-none bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 text-foreground cursor-pointer" required>
                                                                <option value="" disabled>Selecione</option>
                                                                <option value="desligado">Desligado</option>
                                                                <option value="cool">Frio</option>
                                                                <option value="heat">Quente</option>
                                                                <option value="auto">Automático</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                                                                <BiChevronDown />
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                                <div className="flex flex-col gap-2 focus-within:text-ring transition-colors">
                                        <label htmlFor="config_ventilacao" className="text-sm font-medium text-foreground">Ventilação</label>
                                        <div className="relative">
                                                <select name="config_ventilacao" id="config_ventilacao" defaultValue="" className="w-full appearance-none bg-input border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all hover:border-primary/50 text-foreground cursor-pointer" required>
                                                        <option value="" disabled>Selecionar ventilação</option>
                                                        <option value="low">Baixa</option>
                                                        <option value="mid">Média</option>
                                                        <option value="high">Alta</option>
                                                        <option value="auto">Automática</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                                                        <BiChevronDown />
                                                </div>
                                        </div>
                                </div>

                                <button type="submit" className="bg-green-400 text-black hover:bg-green-900  justify-center items-center flex gap-2 py-3 rounded-2xl">
                                        <BiPlus />
                                        <span className="z-10">Adicionar Código</span>
                                </button>
                        </div>
                </form>
        );
}