# RAISE - Rede de Automação Institucional por Sistemas Embarcados

**RAISE** é um projeto desenvolvido por alunos do **IFRN Campus Parnamirim**, focado na otimização da gestão energética e na modernização dos processos de automação institucional. O sistema visa oferecer uma interface intuitiva e eficiente para o monitoramento e controle de recursos, integrando tecnologias web modernas com sistemas embarcados.

## 🚀 Funcionalidades

O sistema conta com diversas funcionalidades voltadas para automação e monitoramento:

*   **Gestão de Salas**: Visualização e controle de parâmetros ambientais (temperatura, iluminação) das salas de aula e laboratórios.
*   **Controle de Acesso**: Monitoramento e controle de portas via integração MQTT.
*   **Monitoramento em Tempo Real**: Comunicação bidirecional com dispositivos embarcados utilizando protocolo MQTT.
*   **Interface Interativa 3D**: Elementos visuais ricos e interativos utilizando Three.js para uma experiência de usuário imersiva.
*   **Design Responsivo e Moderno**: Interface adaptável a diferentes dispositivos, com suporte a temas (Claro/Escuro).
*   **Dashboard Administrativo**: Visão geral do status do sistema e controles rápidos.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza uma stack moderna e robusta para garantir performance e escalabilidade:

*   **Framework Web**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animações**: [Framer Motion](https://www.framer.com/motion/)
*   **Elementos 3D**: [Three.js](https://threejs.org/) com [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) e [@react-three/drei](https://github.com/pmndrs/drei)
*   **Comunicação IoT**: [MQTT.js](https://github.com/mqttjs/MQTT.js)
*   **Banco de Dados**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
*   **Ícones**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

## 📦 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter instalado:
*   [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
*   Gerenciador de pacotes (npm, yarn, pnpm ou bun)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/raise.git
    cd raise
    ```

2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto. **Não compartilhe este arquivo publicamente.**
    
    ```env
    # Configurações do Banco de Dados
    POSTGRES_URL="sua_string_de_conexao_postgres"
    
    # Configurações MQTT (Obrigatório)
    # Substitua pela URL do seu broker. Exemplo: wss://broker.exemplo.com:8083/mqtt
    NEXT_PUBLIC_MQTT_BROKER_URL="wss://seu-broker-mqtt:8083/mqtt"
    ```

    > **Nota de Segurança:** A URL do broker MQTT é sensível. Certifique-se de que o arquivo `.env` está listado no seu `.gitignore` para evitar vazamento de credenciais.

4.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

5.  Acesse o projeto no navegador:
    Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 📂 Estrutura do Projeto

A estrutura principal do código fonte está organizada da seguinte forma:

```
src/
├── app/                 # Rotas e páginas do Next.js (App Router)
│   ├── api/             # API Routes
│   ├── components/      # Componentes React reutilizáveis
│   ├── portas/          # Página de controle de portas
│   ├── salas/           # Página de gestão de salas
│   ├── layout.tsx       # Layout principal da aplicação
│   └── page.tsx         # Página inicial (Home)
├── components/          # (Legado/Outros componentes)
└── ...
```

## 🤝 Contribuição

Este é um projeto acadêmico e colaborativo. Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---
Desenvolvido com 💙 por alunos do IFRN Campus Parnamirim.
