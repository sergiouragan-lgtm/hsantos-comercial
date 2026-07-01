import { AOA_PER_UNIT, CURRENCY_SYMBOL } from "./constants";
import type { CurrencyCode, Debt, DebtStats, SimResult, Strategy } from "@/types";
import type { TrDict } from "./translations";

export function fmtMoney(amountAOA: number, currency: CurrencyCode): string {
  const rate = AOA_PER_UNIT[currency] || 1;
  const symbol = CURRENCY_SYMBOL[currency] || "Kz";
  if (!isFinite(amountAOA)) return "—";
  const val = amountAOA / rate;
  const neg = val < 0;
  const fixed = Math.abs(val).toFixed(2);
  const dotIndex = fixed.indexOf(".");
  const intPart = fixed.slice(0, dotIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decPart = fixed.slice(dotIndex + 1);
  return (neg ? "-" : "") + symbol + " " + intPart + "," + decPart;
}

export function orderSnowball(debts: Debt[]): string[] {
  return debts
    .slice()
    .sort((a, b) => a.balance - b.balance)
    .map((d) => d.id);
}

export function orderAvalanche(debts: Debt[]): string[] {
  return debts
    .slice()
    .sort((a, b) => b.rate - a.rate)
    .map((d) => d.id);
}

export function simulate(debts: Debt[], extra: number, order: string[]): SimResult {
  const bals: Record<string, number> = {};
  debts.forEach((d) => {
    bals[d.id] = d.balance;
  });
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600;
  let remainingOrder = order.filter((id) => bals[id] > 0);

  while (remainingOrder.some((id) => bals[id] > 0) && months < maxMonths) {
    months++;
    debts.forEach((d) => {
      if (bals[d.id] <= 0) return;
      const interest = bals[d.id] * (d.rate / 100);
      totalInterest += interest;
      bals[d.id] += interest;
      const pay = Math.min(d.minPay, bals[d.id]);
      bals[d.id] -= pay;
    });
    let pool = extra;
    for (let i = 0; i < remainingOrder.length; i++) {
      const id = remainingOrder[i];
      if (pool <= 0) break;
      if (bals[id] <= 0) continue;
      const pay2 = Math.min(pool, bals[id]);
      bals[id] -= pay2;
      pool -= pay2;
    }
    remainingOrder = remainingOrder.filter((id) => bals[id] > 0.5);
  }
  return { months, totalInterest, cleared: months < maxMonths };
}

export function monthsLabel(m: number, tr: TrDict): string {
  if (m <= 0) return "—";
  return m + " " + tr.monthsUnit;
}

export function computeDebtStats(debts: Debt[], income: number, essentials: number, strategy: Strategy): DebtStats {
  const totalDebt = debts.reduce((a, d) => a + (d.balance || 0), 0);
  const totalMin = debts.reduce((a, d) => a + (d.minPay || 0), 0);
  const freeCash = Math.max(income - essentials - totalMin, 0);
  const order = strategy === "snowball" ? orderSnowball(debts) : orderAvalanche(debts);
  const otherOrder = strategy === "snowball" ? orderAvalanche(debts) : orderSnowball(debts);
  let sim: SimResult = { months: 0, totalInterest: 0, cleared: true };
  let simOther: SimResult = { months: 0, totalInterest: 0, cleared: true };
  let focusDebt: Debt | null = null;

  if (debts.length > 0 && totalDebt > 0) {
    sim = simulate(debts, freeCash, order);
    simOther = simulate(debts, freeCash, otherOrder);
    const focusId = order.find((id) => {
      const d = debts.find((x) => x.id === id);
      return d && d.balance > 0;
    });
    focusDebt = debts.find((d) => d.id === focusId) || null;
  }

  return { totalDebt, totalMin, freeCash, sim, simOther, focusDebt };
}
