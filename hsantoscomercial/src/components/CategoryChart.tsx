"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#16b369",
  "#3ecd86",
  "#0a9054",
  "#7be3ac",
  "#097245",
  "#b0f1cb",
  "#0b5a39",
  "#d6f9e3",
];

export default function CategoryChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="grid h-64 place-items-center text-sm text-slate-400">
        Sem gastos no período.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
