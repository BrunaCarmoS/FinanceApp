# Controle Financeiro

**[🇧🇷 Português](./README.pt-BR.md)** | 🇺🇸 English

Personal finance management system built as a portfolio project, focused on software engineering best practices: static typing, runtime validation, automated testing, and modular architecture.

## About the project

An application for managing personal finances, allowing income and expense tracking, organization by categories and accounts, budget and goal definitions, and financial report visualization through charts.

The system is **single-tenant** (personal use, no multi-user support) — an intentional decision to keep the scope focused on financial domain functionality, without the added complexity of user data isolation (Row Level Security, multi-tenancy), which wouldn't add real value for the proposed use case.

## Features

- **Transactions** — create, delete, and filter income and expenses; can be linked to a category and/or a goal
- **Accounts** — track balance per account (e.g. wallet, bank, card)
- **Categories** — organize transactions by spending/income type, with custom color picker (preset palette + native color wheel + hex input)
- **Budgets** — set spending limits per category, with custom date ranges (including quick presets: 7 days, 15 days, 1 month, 5 months, 1 year) and a real-time progress bar comparing actual spend to the limit
- **Goals** — track financial objectives; progress is calculated from actual expense transactions linked to the goal, not a manually-entered value
- **Recurrences** — automate transactions that repeat (subscriptions, salary, etc.), generated on demand whenever the Transactions or Recurrences screens are loaded, based on frequency (daily/weekly/monthly/yearly) and an optional end date
- **Dashboard** — summary view of total income, total expenses, and overall balance across all accounts

## Tech stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Forms & validation | React Hook Form + Zod |
| Server state | TanStack Query |
| Charts | Recharts |
| ORM | Prisma |
| Database | PostgreSQL (local for development, Supabase-ready for production) |
| Unit testing | Vitest |
| E2E testing | Playwright |
| CI/CD | GitHub Actions |

## Technical decisions

- **No authentication/multi-user support**: the system was designed for single personal use. User-level data isolation (RLS, a profile table tied to `auth.users`) was deliberately left out of scope, since it doesn't reflect the actual use case.
- **Prisma + PostgreSQL**: Prisma handles typed data access and schema migrations. The project runs against a local PostgreSQL instance in development, with Supabase's managed Postgres as the production target.
- **Runtime validation with Zod**: TypeScript guarantees compile-time safety, but data coming from forms/API requests is validated again at runtime with Zod.
- **REST over GraphQL**: a conventional API via Next.js Route Handlers, sufficient for the project's scope and more straightforward to demonstrate/document.
- **On-demand recurrence generation**: instead of a background job/cron process, recurring transactions are generated when the Transactions or Recurrences screens load. Simpler to run for a single-user local project, with no extra infrastructure required.
- **Computed progress over stored values**: both Budget "spent" and Goal "current amount" are calculated by aggregating linked Transaction records at read time, rather than storing and manually updating a running total — keeping a single source of truth and avoiding drift.

## Running locally

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (via [pgAdmin](https://www.pgadmin.org/), the `postgresql` service, or any local install)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/controle-financeiro.git
cd controle-financeiro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the local database

Using pgAdmin (or `psql`), create a database, e.g.:

```sql
CREATE DATABASE controle_financeiro;
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your local connection:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/controle_financeiro"
DIRECT_URL="postgresql://postgres:your-password@localhost:5432/controle_financeiro"
```

> If your password contains special characters (`@`, `#`, `%`, `/`, spaces), it must be URL-encoded in the connection string, or the connection will fail.

### 5. Run migrations

```bash
npx prisma migrate dev
npx prisma generate
```

> **Troubleshooting note**: on some networks, Node.js prioritizes IPv6 DNS resolution, which can cause a `P1001: Can't reach database server` error even with correct credentials. If this happens, run:
> ```bash
> NODE_OPTIONS="--dns-result-order=ipv4first" npx prisma migrate dev
> ```
> To make the fix permanent, add this to the top of `prisma.config.ts`:
> ```typescript
> import dns from "node:dns";
> dns.setDefaultResultOrder("ipv4first");
> ```

### 6. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Running tests

```bash
npm run test        # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright)
```

## Deploying with Supabase

For production, the project is designed to run against [Supabase](https://supabase.com)'s managed PostgreSQL. In the Supabase dashboard, use the **Connect** button (top of the project page) → **ORM** tab to get the pooled (`DATABASE_URL`) and direct (`DIRECT_URL`) connection strings, and set them as environment variables on your deployment platform.

## License

Built for study and portfolio purposes.