# HabitZen

Rastreador de hábitos gamificado com sistema de XP e níveis.

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a URL e a chave anônima do projeto
3. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3. Aplicar migrações do banco de dados

Execute o SQL do arquivo `supabase/migrations/001_initial_schema.sql` no SQL Editor do Supabase.

### 4. Executar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `app/` - Páginas e rotas (Next.js App Router)
- `components/` - Componentes React reutilizáveis
  - `ui/` - Componentes base do shadcn/ui
  - `habits/` - Componentes relacionados a hábitos
  - `gamification/` - Componentes de gamificação
  - `charts/` - Componentes de gráficos
  - `layout/` - Componentes de layout
- `lib/` - Utilitários, helpers e server actions
  - `supabase/` - Clientes Supabase (browser/server/middleware)
  - `utils/` - Funções utilitárias
  - `actions/` - Server actions
- `supabase/` - Migrações do banco de dados
- `types/` - Definições TypeScript
- `tests/` - Testes E2E com Playwright

## Funcionalidades

- ✅ Autenticação com Supabase (login/registro)
- ✅ Criação e gerenciamento de hábitos (diários/semanais)
- ✅ Sistema de XP e níveis (cálculo automático via triggers)
- ✅ Calendário de hábitos completados
- ✅ Gráficos de progresso (XP, completions, heatmap)
- ✅ Gamificação visual (streaks, level progress)
- ✅ Interface responsiva
- ✅ Testes E2E com Playwright

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa o linter
- `npm run test:e2e` - Executa testes E2E

## Tecnologias

- Next.js 15 (App Router)
- TypeScript
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- shadcn/ui
- recharts
- date-fns
- Playwright

