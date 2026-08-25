# Controle Financeiro

Sistema de gestão financeira pessoal desenvolvido como projeto de portfólio, com foco em boas práticas de engenharia de software: tipagem estática, validação em runtime, testes automatizados e arquitetura modular.

## Sobre o projeto

Aplicação para controle de finanças pessoais permitindo o registro de receitas e despesas, organização por categorias e contas, definição de orçamentos e metas, e visualização de relatórios financeiros através de gráficos.

O sistema é **single-tenant** (uso pessoal, sem multiusuário) — decisão intencional para manter o escopo focado nas funcionalidades de domínio financeiro, sem a complexidade adicional de isolamento de dados entre usuários (Row Level Security, multi-tenancy), que não agregaria valor real para o caso de uso proposto.

## Funcionalidades

- **Transações** — cadastro, edição, exclusão e filtro de receitas e despesas
- **Contas** — controle de saldo por conta (ex: carteira, banco, cartão)
- **Categorias** — organização das transações por tipo de gasto/receita
- **Orçamentos** — definição de limites de gasto por categoria
- **Metas** — acompanhamento de objetivos financeiros
- **Recorrências** — automação de transações que se repetem (assinaturas, salário)
- **Relatórios** — visualização gráfica de receitas, despesas e evolução de saldo

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
| Banco de dados | PostgreSQL (Supabase) |
| Testes unitários | Vitest |
| Testes E2E | Playwright |
| CI/CD | GitHub Actions |

## Decisões técnicas

- **Sem autenticação/multiusuário**: o sistema foi projetado para uso pessoal único. Isolamento de dados por usuário (RLS, tabela de perfil vinculada a `auth.users`) foi deliberadamente deixado de fora do escopo por não refletir o caso de uso real.
- **Prisma + Supabase**: Prisma cuida do acesso tipado e das migrations do schema; Supabase fornece a infraestrutura de Postgres gerenciado.
- **Zod em runtime**: tipagem do TypeScript garante segurança em tempo de compilação, mas dados vindos de formulários/API são validados novamente em runtime com Zod.
- **REST em vez de GraphQL**: API convencional via Route Handlers do Next.js, suficiente para o escopo do projeto e mais direta de demonstrar/documentar.

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Uma conta no [Supabase](https://supabase.com)

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/controle-financeiro.git
cd controle-financeiro
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar um projeto no Supabase

Em [app.supabase.com](https://app.supabase.com), crie um novo projeto e aguarde o banco provisionar (leva cerca de 2 minutos). Anote a senha do banco definida na criação — ela será usada nas connection strings.

### 4. Obter as credenciais de conexão

Dentro do projeto criado, clique no botão **Connect** (topo do dashboard) e selecione a aba **ORM**. Copie as duas connection strings exibidas (uma para pooler de transação, outra para conexão direta/migrations).

Para as chaves de API, vá em **Project Settings → API Keys** e copie a **Project URL** e a chave **Publishable** (em projetos mais antigos, pode aparecer como `anon` `public` na aba "Legacy API Keys" — funciona da mesma forma).

### 5. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com os valores obtidos no passo anterior:

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[sua-senha]@aws-0-[região].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[sua-senha]@aws-0-[região].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
```

> Se a senha do banco contiver caracteres especiais (`@`, `#`, `%`, `/`, espaço), ela precisa estar URL-encoded na connection string, ou a conexão falha.

### 6. Rodar as migrations

```bash
npx prisma migrate dev
```

> **Nota de troubleshooting**: em algumas redes, o Node.js prioriza resolução DNS via IPv6, o que pode causar erro `P1001: Can't reach database server` mesmo com as credenciais corretas (um teste rápido com `psql` usando a mesma string geralmente conecta normalmente, confirmando que o problema é específico do Node). Se isso acontecer, rode:
> ```bash
> NODE_OPTIONS="--dns-result-order=ipv4first" npx prisma migrate dev
> ```
> Para tornar a correção permanente, adicione no topo do `prisma.config.ts`:
> ```typescript
> import dns from "node:dns";
> dns.setDefaultResultOrder("ipv4first");
> ```

### 7. Subir o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Rodando os testes

```bash
npm run test        # testes unitários (Vitest)
npm run test:e2e     # testes end-to-end (Playwright)
```

## Licença

Projeto desenvolvido para fins de estudo e portfólio.


traduzir pra ingles tbm.