import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { statsStore, historyStore, type Stats, type HistoryEntry } from "@/lib/store";
import { BarChart3, Hand, Calendar, Target, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SignBridge AI" },
      { name: "description", content: "Stats and analytics for your SignBridge translations." },
      { property: "og:title", content: "Dashboard — SignBridge AI" },
      { property: "og:description", content: "Translation stats at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setStats(statsStore.get());
    setItems(historyStore.list());
  }, []);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const i of items) counts[i.gesture] = (counts[i.gesture] ?? 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [items]);

  const accuracy = stats && stats.accuracyCount > 0
    ? Math.round((stats.accuracySum / stats.accuracyCount) * 100)
    : 0;

  const cards = [
    { label: "Total Gestures", value: stats?.totalGestures ?? 0, icon: Hand },
    { label: "Today", value: stats?.todayCount ?? 0, icon: Calendar },
    { label: "Accuracy", value: `${accuracy}%`, icon: Target },
    { label: "Sessions", value: stats?.sessions ?? 0, icon: Users },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header>
          <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">A quick view of your translation activity.</p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="card-elevated relative overflow-hidden p-6">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-gradient opacity-10 blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient/10">
                  <c.icon className="h-4 w-4 text-brand-gradient" />
                </div>
              </div>
              <div className="mt-3 font-display text-4xl font-bold">{c.value}</div>
            </div>
          ))}
        </div>

        <div className="card-elevated mt-8 p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand-gradient" />
            <h2 className="text-lg font-semibold">Gestures by frequency</h2>
          </div>
          <div className="mt-6 h-72">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-brand)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Translate some signs to see your chart here.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
