# Caminho Livre

App de quitação de dívidas (Next.js 14 + TypeScript + Tailwind), instalável como PWA. Ajuda a sair de dívidas com as estratégias **bola de neve** e **avalanche**, orçamento mensal, CRM de credores e um assistente local (sem backend).

## Funcionalidades

- **Onboarding**: login / criação de conta / escolha de plano / pagamento (simulado) / ativação por código.
- **Início**: progresso até à liberdade financeira, dívida total, sobra do mês, sequência de meses cumpridos.
- **Dívidas**: gestão de dívidas com estratégia bola de neve ou avalanche, simulação de meses até à quitação e juros pagos.
- **CRM**: estado de negociação por credor (por contactar, em negociação, acordo feito, pago), contacto direto por WhatsApp e lembretes.
- **Orçamento**: sugestão de divisão do rendimento entre essenciais, dívida, reserva de emergência e liberdade.
- **Assistente**: assistente local baseado em regras (sem ligação a servidores externos) que responde sobre a estratégia e cria lembretes com o comando `anota:`.
- **Mais**: perfil, gestão de assinatura, moeda (AOA, USD, EUR, NGN, AED, ZAR), idioma (pt, en, fr, ar, zu, ha — com RTL para árabe), tema (automático/claro/escuro), notificações push, lembretes, relatório em PDF (impressão) e regras do plano.
- **PWA instalável**: manifest.json, ícones e service worker para uso offline e instalação no ecrã principal.

Todos os dados ficam apenas no dispositivo (`localStorage`), sem qualquer backend.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run start
```
