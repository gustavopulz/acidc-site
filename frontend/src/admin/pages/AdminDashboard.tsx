import { useEffect, useState, useCallback } from "react";
import { api, type Analytics } from "../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const RANGES = [
  { label: "7d",  days: 7  },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function fmt(iso: string) { const [, m, d] = iso.split("-"); return `${d}/${m}`; }

function StatsCard({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div className={`bg-[#111] border rounded-xl p-5 ${accent ? "border-red-500/30" : "border-[#2a2a2a]"}`}
      style={accent ? { boxShadow: "0 0 20px rgba(220,38,38,0.08)" } : {}}>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString("pt-BR")}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  );
}

function CustomTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-zinc-500">{label}</p>
      <p className="text-white font-semibold">{payload[0].value} visitas</p>
    </div>
  );
}

const PAGE_LABEL: Record<string, string> = {
  "/": "Início", "/shows": "Shows", "/media": "Mídia", "/sobre": "Sobre", "/contato": "Contato",
};

export default function AdminDashboard() {
  const [data, setData]     = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange]   = useState(1);
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const fetchData = useCallback(async (days: number) => {
    setLoading(true);
    try {
      const to   = new Date().toISOString().slice(0, 10);
      const from = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
      setData(await api.getAnalytics(from, to));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(RANGES[range].days); }, [range, fetchData]);

  const chartData = data?.dailySeries.map((d) => ({ ...d, date: fmt(d.date) })) ?? [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral de acessos ao site</p>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard label="Hoje"        value={data.today}     sub="desde meia-noite" accent />
            <StatsCard label="Esta semana" value={data.thisWeek}  sub="domingo a hoje" />
            <StatsCard label="Este mês"    value={data.thisMonth} sub="desde dia 1" />
            <StatsCard label="Total"       value={data.total}     sub="desde o início" />
          </div>

          {/* Chart */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Histórico de Visitas</h2>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
                  {(["area", "bar"] as const).map((t) => (
                    <button key={t} onClick={() => setChartType(t)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        chartType === t ? "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"
                      }`}>
                      {t === "area" ? "Área" : "Barras"}
                    </button>
                  ))}
                </div>
                <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
                  {RANGES.map((r, i) => (
                    <button key={r.label} onClick={() => setRange(i)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        range === i ? "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTip />} />
                    <Area type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: "#dc2626" }} />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTip />} />
                    <Bar dataKey="count" fill="#dc2626" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top pages */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Páginas mais acessadas</h2>
            <div className="space-y-3">
              {data.topPages.length === 0
                ? <p className="text-zinc-600 text-sm">Nenhuma visita registrada ainda.</p>
                : data.topPages.map((p, i) => {
                    const pct = Math.round((p.count / (data.topPages[0]?.count ?? 1)) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-zinc-300 font-medium">{PAGE_LABEL[p.page] ?? p.page}</span>
                          <span className="text-zinc-600">{p.count.toLocaleString("pt-BR")}</span>
                        </div>
                        <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                          <div className="h-full bg-red-600/70 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
