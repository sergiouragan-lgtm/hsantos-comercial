# HSantos Comercial — Gastos & CRM via WhatsApp

SaaS de **controle de gastos pessoais** acoplado a um **CRM**, operado pelo
**WhatsApp Business** (Cloud API da Meta) e com painel web completo.

Registre despesas e receitas mandando mensagens como _"gastei 50 no mercado"_,
acompanhe seu orçamento, e gerencie leads/clientes — tudo pelo WhatsApp ou pelo
dashboard.

## ✨ Funcionalidades

- **Controle de gastos**: lançamento de despesas/receitas, categorização
  automática, orçamento mensal e relatórios.
- **CRM**: contatos e leads organizados por funil (Lead → Prospecto →
  Negociação → Cliente), com histórico de interações e follow-ups.
- **WhatsApp Business**: webhook real da Cloud API. Envie comandos em
  linguagem natural (pt-BR) e receba respostas automáticas.
- **Dashboard web**: visão geral com gráficos, gestão de gastos, board de CRM
  e configurações.
- **Multi-tenant**: cada usuário tem seus dados isolados; mensagens são
  associadas ao tenant pelo número de WhatsApp.

## 🧱 Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) + PostgreSQL
- Tailwind CSS + Recharts
- Autenticação própria via JWT (cookie httpOnly, `jose` + `bcryptjs`)

## 🚀 Começando

### 1. Pré-requisitos

- Node.js 18+
- Um banco PostgreSQL

### 2. Instalação

```bash
npm install
cp .env.example .env   # preencha as variáveis
```

Variáveis principais (veja `.env.example`):

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `AUTH_SECRET` | Segredo para assinar a sessão (`openssl rand -base64 32`) |
| `WHATSAPP_TOKEN` | Token da WhatsApp Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID do WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | Token de verificação do webhook (você define) |
| `APP_URL` | URL pública da aplicação |

### 3. Banco de dados

```bash
npm run db:push     # cria as tabelas a partir do schema
npm run db:seed     # (opcional) dados de demonstração
```

Conta demo: **demo@hsantos.com** / **demo1234**

### 4. Rodar

```bash
npm run dev
# http://localhost:3000
```

## 💬 Comandos do WhatsApp

| Você envia | O bot faz |
| --- | --- |
| `gastei 50 no mercado` | Registra despesa categorizada |
| `30 uber` | Registra despesa (despesa é o padrão) |
| `-120 farmácia` | Registra despesa (sinal explícito) |
| `recebi 2000 salário` | Registra receita |
| `+500 venda` | Registra receita |
| `saldo` | Mostra o saldo do mês |
| `relatório` / `relatório semana` / `relatório hoje` | Relatório por categoria |
| `contato Maria 11999998888 empresa Acme` | Cria contato no CRM |
| `leads` | Lista contatos |
| `ajuda` | Mostra o menu de comandos |

## 🔌 Configurando o WhatsApp Business (Cloud API)

1. Crie um app no [Meta for Developers](https://developers.facebook.com/apps) e
   adicione o produto **WhatsApp**.
2. Em **Configuration → Webhook**, configure:
   - **Callback URL**: `https://SEU_DOMINIO/api/webhook/whatsapp`
   - **Verify Token**: o mesmo valor de `WHATSAPP_VERIFY_TOKEN`
   - **Webhook fields**: assine `messages`
3. Copie o **token de acesso** para `WHATSAPP_TOKEN` e o **Phone Number ID**
   para `WHATSAPP_PHONE_NUMBER_ID`.
4. No painel (Configurações), cadastre seu número de WhatsApp para vincular as
   mensagens à sua conta.

> Sem credenciais configuradas, o app funciona normalmente no dashboard e o
> envio de mensagens é apenas logado no console (modo de desenvolvimento).

## 📁 Estrutura

```
prisma/
  schema.prisma         # modelo de dados (multi-tenant)
  seed.ts               # dados de demonstração
src/
  app/
    page.tsx            # landing
    login, register/    # autenticação
    dashboard/          # painel (visão geral, gastos, CRM, configurações)
    api/
      auth/             # registro, login, logout
      transactions/     # CRUD de lançamentos
      contacts/         # CRUD de CRM + interações
      settings/         # perfil/orçamento/WhatsApp
      webhook/whatsapp/ # webhook da Cloud API
  lib/
    prisma.ts           # cliente Prisma
    auth.ts             # sessão/JWT
    whatsapp.ts         # envio via Cloud API
    parser.ts           # interpretação dos comandos (pt-BR)
    conversation.ts     # motor de conversa (intenção → ação → resposta)
    categories.ts       # categorias padrão + categorização automática
    format.ts           # formatação de moeda/datas
```

## 📦 Deploy

O projeto roda bem na **Vercel**. Configure as variáveis de ambiente no painel
da Vercel e aponte o `DATABASE_URL` para um Postgres gerenciado (Neon, Supabase,
Vercel Postgres etc.). Rode `npm run db:push` (ou `prisma migrate deploy`) no
processo de build/deploy.
