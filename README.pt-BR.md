# Controle Financeiro

🇧🇷 Português | **[🇺🇸 English](./README.md)**

Sistema de gestão financeira pessoal desenvolvido como projeto de portfólio, com foco em boas práticas de engenharia de software: tipagem estática, validação em runtime, testes automatizados e arquitetura modular.

## Sobre o projeto

Aplicação para controle de finanças pessoais permitindo o registro de receitas e despesas, organização por categorias e contas, definição de orçamentos e metas, e visualização de relatórios financeiros através de gráficos.

O sistema é **single-tenant** (uso pessoal, sem multiusuário) — decisão intencional para manter o escopo focado nas funcionalidades de domínio financeiro, sem a complexidade adicional de isolamento de dados entre usuários (Row Level Security, multi-tenancy), que não agregaria valor real para o caso de uso proposto.

## Funcionalidades

- **Transações** — cadastro, exclusão e filtro de receitas e despesas; pode ser vinculada a uma categoria e/ou a uma meta
- **Contas** — controle de saldo por conta (ex: carteira, banco, cartão)
- **Categorias** — organização das transações por tipo de gasto/receita, com seletor de cor customizado (paleta pré-definida + roda de cor nativa + campo hex)
- **Orçamentos** — definição de limites de gasto por categoria, com período customizável (incluindo presets rápidos: 7 dias, 15 dias, 1 mês, 5 meses, 1 ano) e barra de progresso em tempo real comparando gasto real vs. limite
- **Metas** — acompanhamento de objetivos financeiros; o progresso é calculado a partir das transações de despesa vinculadas à meta, não um valor digitado manualmente
- **Recorrências** — automação de transações que se repetem (assinaturas, salário etc.), geradas sob demanda sempre que as telas de Transações ou Recorrências carregam, com base em frequência (diária/semanal/mensal/anual) e data final opcional
- **Dashboard** — resumo com total de receitas, total de despesas e saldo geral de todas as contas

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Formulários e validação | React Hook Form + Zod |
| Estado do servidor | TanStack Query |
| Gráficos | Recharts |
| ORM | Prisma |
| Banco de dados | PostgreSQL (local em desenvolvimento, pronto para Supabase em produção) |
| Testes unitários | Vitest |
| Testes E2E | Playwright |
| CI/CD | GitHub Actions |

## Decisões técnicas

- **Sem autenticação/multiusuário**: o sistema foi projetado para uso pessoal único. Isolamento de dados por usuário (RLS, tabela de perfil vinculada a `auth.users`) foi deliberadamente deixado de fora do escopo por não refletir o caso de uso real.
- **Prisma + PostgreSQL**: Prisma cuida do acesso tipado e das migrations do schema. O projeto roda contra um Postgres local em desenvolvimento, com o Postgres gerenciado do Supabase como alvo de produção.
- **Zod em runtime**: tipagem do TypeScript garante segurança em tempo de compilação, mas dados vindos de formulários/API são validados novamente em runtime com Zod.
- **REST em vez de GraphQL**: API convencional via Route Handlers do Next.js, suficiente para o escopo do projeto e mais direta de demonstrar/documentar.
- **Geração de recorrências sob demanda**: em vez de um job/cron rodando em segundo plano, as transações recorrentes são geradas quando as telas de Transações ou Recorrências carregam. Mais simples de rodar num projeto local de uso único, sem exigir infraestrutura extra.
- **Progresso calculado em vez de armazenado**: tanto o "gasto" do Orçamento quanto o "valor atual" da Meta são calculados agregando as transações vinculadas no momento da leitura, em vez de guardar e atualizar manualmente um total acumulado — mantém uma única fonte de verdade e evita divergência.

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente (via [pgAdmin](https://www.pgadmin.org/), o serviço `postgresql`, ou qualquer instalação local)

### 1. Clonar o repositório

```bash
git clone https://github.com/BrunaCarmoS/FinanceApp.git
cd controle-financeiro
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o banco de dados local

Usando o pgAdmin (ou `psql`), cria um banco, ex:

```sql
CREATE DATABASE controle_financeiro;
```

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preenche o `.env` com sua conexão local:

```env
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/controle_financeiro"
DIRECT_URL="postgresql://postgres:suasenha@localhost:5432/controle_financeiro"
```

> Se sua senha tiver caracteres especiais (`@`, `#`, `%`, `/`, espaço), ela precisa estar URL-encoded na connection string, ou a conexão falha.

### 5. Rodar as migrations

```bash
npx prisma migrate dev
npx prisma generate
```

> **Nota de troubleshooting**: em algumas redes, o Node.js prioriza resolução DNS via IPv6, o que pode causar erro `P1001: Can't reach database server` mesmo com as credenciais corretas. Se isso acontecer, roda:
> ```bash
> NODE_OPTIONS="--dns-result-order=ipv4first" npx prisma migrate dev
> ```
> Pra tornar a correção permanente, adiciona no topo do `prisma.config.ts`:
> ```typescript
> import dns from "node:dns";
> dns.setDefaultResultOrder("ipv4first");
> ```

### 6. Subir o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Rodando os testes

```bash
npm run test        # testes unitários (Vitest)
npm run test:e2e     # testes end-to-end (Playwright)
```

## Deploy com Supabase

Pra produção, o projeto foi pensado pra rodar contra o Postgres gerenciado do [Supabase](https://supabase.com). No dashboard do Supabase, usa o botão **Connect** (topo da página do projeto) → aba **ORM** pra pegar as connection strings pooled (`DATABASE_URL`) e direta (`DIRECT_URL`), e configura elas como variáveis de ambiente na sua plataforma de deploy.

## Licença

Projeto desenvolvido para fins de estudo e portfólio.
