
## Sistema de gestão financeira pessoal desenvolvido como projeto de portfólio, 
- com foco em boas práticas de engenharia de software: tipagem estática, validação em runtime, testes automatizados e arquitetura modular.

## Sobre o projeto

Aplicação para controle de finanças pessoais permitindo o registro de receitas e despesas, organização por categorias e contas, definição de orçamentos e metas, e visualização de relatórios financeiros através de gráficos.

O sistema é **single-tenant** (uso pessoal, sem multiusuário) — decisão intencional para manter o escopo focado nas funcionalidades de domínio financeiro, sem a complexidade adicional de isolamento de dados entre usuários (Row Level Security, multi-tenancy), que não agregaria valor real para o caso de uso proposto.

##  Funcionalidades

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

##  Decisões técnicas

- **Sem autenticação/multiusuário**: o sistema foi projetado para uso pessoal único. Isolamento de dados por usuário (RLS, tabela de perfil vinculada a `auth.users`) foi deliberadamente deixado de fora do escopo por não refletir o caso de uso real.
- **Prisma + Supabase**: Prisma cuida do acesso tipado e das migrations do schema; Supabase fornece a infraestrutura de Postgres gerenciado.
- **Zod em runtime**: tipagem do TypeScript garante segurança em tempo de compilação, mas dados vindos de formulários/API são validados novamente em runtime com Zod.
- **REST em vez de GraphQL**: API convencional via Route Handlers do Next.js, suficiente para o escopo do projeto e mais direta de demonstrar/documentar.

##  Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Uma conta no [Supabase](https://supabase.com)

### Passos

```bash
# clonar o repositório
git clone https://github.com/seu-usuario/controle-financeiro.git
cd controle-financeiro

# instalar dependências
npm install

# configurar variáveis de ambiente
cp .env.example .env
# preencher DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
# com os dados do seu projeto Supabase

# rodar as migrations
npx prisma migrate dev

# subir o servidor de desenvolvimento
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