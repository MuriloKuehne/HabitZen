# HabitZen

Um aplicativo moderno de rastreamento de hábitos com sistema de gamificação, desenvolvido com Next.js 15 e Supabase.

## 📋 Sobre o Projeto

HabitZen é uma aplicação web que ajuda você a criar e manter hábitos através de um sistema gamificado. Complete seus hábitos diários ou semanais, ganhe XP, suba de nível e mantenha suas sequências (streaks) para construir uma rotina consistente.

## ✨ Funcionalidades

- **Autenticação Segura**: Sistema de login e registro com Supabase Auth
- **Gerenciamento de Hábitos**: Crie e gerencie hábitos diários ou semanais
- **Sistema de Gamificação**:
  - Ganhe XP ao completar hábitos
  - Sistema de níveis automático
  - Contador de sequências (streaks)
  - Barra de progresso de nível
- **Visualizações**:
  - Calendário de hábitos completados (heatmap)
  - Gráficos de progresso de XP
  - Gráficos de completions
  - Estatísticas detalhadas
- **Interface Moderna**: Design responsivo com Tailwind CSS e shadcn/ui
- **Testes E2E**: Testes automatizados com Playwright

## 🛠️ Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Gráficos**: Recharts
- **Validação**: Zod
- **Utilitários**: date-fns
- **Testes**: Playwright

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- npm ou yarn

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/habitzen.git
cd habitzen
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o Supabase**

   - Crie um projeto no [Supabase](https://supabase.com)
   - Copie a URL do projeto e a chave anônima (anon key)
   - Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

4. **Configure o banco de dados**

   - Acesse o SQL Editor no painel do Supabase
   - Execute o SQL do arquivo `supabase/migrations/001_initial_schema.sql`
   - Isso criará todas as tabelas, funções e triggers necessários

5. **Execute o projeto**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
habitzen/
├── app/                      # Páginas e rotas (Next.js App Router)
│   ├── (auth)/              # Grupo de rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard e páginas protegidas
│   │   ├── habits/         # Gerenciamento de hábitos
│   │   └── stats/          # Estatísticas
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página inicial
│   └── middleware.ts       # Middleware de autenticação
├── components/              # Componentes React
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── habits/             # Componentes de hábitos
│   ├── gamification/       # Componentes de gamificação
│   ├── charts/             # Componentes de gráficos
│   └── layout/             # Componentes de layout
├── lib/                     # Utilitários e lógica
│   ├── supabase/           # Clientes Supabase
│   │   ├── client.ts       # Cliente para browser
│   │   ├── server.ts       # Cliente para server components
│   │   └── middleware.ts   # Cliente para middleware
│   ├── actions/            # Server actions
│   │   ├── auth-actions.ts
│   │   ├── habit-actions.ts
│   │   ├── completion-actions.ts
│   │   └── stats-actions.ts
│   └── utils/              # Funções utilitárias
│       ├── date-helpers.ts
│       ├── validations.ts
│       └── xp-calculations.ts
├── supabase/               # Migrações do banco de dados
│   └── migrations/
│       └── 001_initial_schema.sql
├── types/                   # Definições TypeScript
│   └── habit.types.ts
└── tests/                   # Testes E2E
    └── example.spec.ts
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint
- `npm run test:e2e` - Executa os testes E2E com Playwright

## 🎮 Sistema de Gamificação

### XP e Níveis

- **Hábitos Diários**: 10 XP por completação
- **Hábitos Semanais**: 50 XP por completação
- O nível é calculado automaticamente com base no XP total
- Fórmula: `level = floor(sqrt(total_xp / 100)) + 1`

### Sequências (Streaks)

- Mantenha sua sequência completando hábitos diários consecutivamente
- A sequência atual e a maior sequência são rastreadas automaticamente
- Quebrar a sequência reseta o contador atual

## 🔒 Segurança

- Autenticação gerenciada pelo Supabase
- Row Level Security (RLS) no banco de dados
- Validação de dados com Zod
- Middleware de autenticação para rotas protegidas
- Variáveis de ambiente para credenciais sensíveis

## 🧪 Testes

O projeto inclui testes E2E com Playwright. Para executar:

```bash
npm run test:e2e
```

## 📝 Licença

Este projeto é privado e de uso pessoal.

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões e melhorias são bem-vindas!

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e Supabase
